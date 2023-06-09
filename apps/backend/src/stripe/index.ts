import { slackSendMsg } from "../libs/slack";
import Stripe from "stripe";
import { logger, db, functions } from "../fcm";
import { RaceEntry, Team } from "@8hourrelay/models";

const apiKey = process.env.STRIPE_SECRET;
// Stripe Signing secret
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const stripe = new Stripe(apiKey!, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export const stripeWebhook = functions.https.onRequest(
  async (
    request: functions.https.Request,
    response: functions.Response<void>
  ) => {
    logger.info("Stripe Webhook Event", { body: request });
    const sig = request.headers["stripe-signature"];
    let event: Stripe.Event;
    try {
      if (!sig) {
        response.status(200).end();
        return;
      }
      try {
        event = stripe.webhooks.constructEvent(
          request.rawBody,
          sig,
          endpointSecret!
        );
      } catch (err) {
        await slackSendMsg(`Failed to validate stripe signature!!`);
        response.status(400).send();
        return;
      }
      logger.info("Processing Stripe Event", { event });
      const {
        type,
        data: { object },
      } = event;

      const now = new Date().getTime();
      switch (type) {
        // somehow this call always arrives first, when paymentId is not being saved to the DB yet
        case "payment_intent.succeeded": {
          const paymentIntent = object as Stripe.PaymentIntent;
          const msg = `🔔  Webhook received! Payment for PaymentIntent ${paymentIntent.id} succeeded.`;
          logger.info(msg);
          const userSnapshot = await db
            .collectionGroup("RaceEntry")
            .where("paymentId", "==", paymentIntent.id)
            .where("isActive", "==", true)
            .get();

          if (userSnapshot.size > 0) {
            const userRaceEntry = userSnapshot.docs[0].data() as RaceEntry;
            if (!userRaceEntry || !userRaceEntry.team) {
              throw new Error(
                `Failed to find user with paymentId ${paymentIntent.id}`
              );
            }

            const year = new Date().getFullYear().toString();

            const teamRef = await db
              .collection("Race")
              .doc(year)
              .collection("Teams")
              .where("name", "==", userRaceEntry.team)
              .get();

            if (teamRef.size === 0) {
              throw new Error(`No team found ${userRaceEntry.team}!`);
            }

            const team = teamRef.docs[0].data() as Team;
            const teamMembers = team.teamMembers
              ? [...team.teamMembers, paymentIntent.id]
              : [paymentIntent.id];

            // const data = userSnapshot.docs[0].data();
            // payment intent completed, update user and transaction data
            await Promise.all([
              slackSendMsg(
                `Race entry ${userRaceEntry.email} paid for ${userRaceEntry.race} and joined team ${userRaceEntry.team}. Total members is ${teamMembers.length}}`
              ),
              db
                .collection("StripeEvents")
                .doc(paymentIntent.id)
                .create(paymentIntent),
              userSnapshot.size > 0 &&
                userSnapshot.docs[0].ref.set(
                  {
                    teamState: "APPROVED",
                    isPaid: true,
                    teamId: teamRef.docs[0].ref.id,
                    updatedAt: now,
                  },
                  { merge: true }
                ),
              teamRef.docs[0].ref.set(
                { teamMembers, updatedAt: now },
                { merge: true }
              ),
            ]);
          } else {
            await Promise.all([
              slackSendMsg(msg),
              db
                .collection("StripeEvents")
                .doc(paymentIntent.id)
                .create(paymentIntent),
            ]);
          }
          break;
        }
        case "payment_intent.payment_failed": {
          const paymentIntent = object as Stripe.PaymentIntent;
          const msg = `🔔  Webhook received! Payment for PaymentIntent ${paymentIntent.id} failed.`;
          logger.info(msg);
          await Promise.all([slackSendMsg(msg)]);
          break;
        }
        // An invoice.payment_succeeded event is sent to indicate that the invoice was marked paid.
        // process subscription when it is already paid
        case "invoice.payment_succeeded": {
          const invoice = event.data.object as Stripe.Invoice;
          const msg = `Invoice ${invoice.id} payment_succeeded`;
          logger.info(msg);
          await Promise.all([slackSendMsg(msg)]);
          break;
        }
        /* Once the source is chargeable, from your source.chargeable webhook handler, you can make a charge request using the source ID as the value for the source parameter to complete the payment
         */
        case "source.chargeable": {
          const source = event.data.object as Stripe.Source;
          const msg = `🔔  Webhook received! The source ${source.id} is chargeable.`;
          logger.info(msg);
          if (source.metadata?.paymentIntent) {
            // Confirm the PaymentIntent with the chargeable source.
            await Promise.all([slackSendMsg(msg)]);
          }
          break;
        }
        case "source.failed":
        case "source.canceled": {
          const source = object as Stripe.Source;
          const msg = `🔔  The source ${source.id} failed or timed out.`;
          logger.info(msg);
          if (source.metadata?.paymentIntent) {
            await Promise.all([slackSendMsg(msg)]);
          }
          break;
        }
        // for metered billing host plan should go here
        case "invoice.created": {
          const invoice = object as Stripe.Invoice;
          const msg = `🔔  The invoice ${invoice.id} created.`;
          logger.info(msg);
          await slackSendMsg(msg);
          // await Subscription.addInvoiceItems
          break;
        }
        // for wechat && Alipay payment webhooks
        case "charge.succeeded": {
          const charge = object as Stripe.Charge;
          const msg = `🔔  The charge ${charge.id} succeeded.`;
          logger.info(msg);
          const userSnapshot = await db
            .collectionGroup("RaceEntry")
            .where("paymentId", "==", charge.payment_intent)
            .where("isActive", "==", true)
            .get();
          await Promise.all([
            // slackSendMsg(msg),
            db.collection("StripeEvents").doc(charge.id).create(charge),
            userSnapshot.size > 0 &&
              userSnapshot.docs[0].ref.set(
                {
                  receiptNumber: charge.receipt_number, // receipt number
                  receiptUrl: charge.receipt_url,
                  updatedAt: now,
                },
                { merge: true }
              ),
          ]);
          break;
        }
        case "checkout.session.completed": {
          const session = object as Stripe.Checkout.Session;
          const msg = `🔔  Session ${session.id} completed!`;
          logger.info(msg);
          const sessionId = session.id;
          if (!session.payment_intent) {
            throw new Error(`No payment Intent!!`);
          }
          const [dbRef, payment] = await Promise.all([
            db
              .collectionGroup("RaceEntry")
              .where("sessionId", "==", sessionId)
              .where("isActive", "==", true)
              .get(),
            stripe.paymentIntents.retrieve(session.payment_intent as string),
          ]);

          logger.debug(`payment intent`, { payment });
          if (dbRef.size === 0 || !payment) {
            throw new Error(
              `Could not find payment for this session ID ${sessionId}`
            );
          }

          const userRaceEntry = dbRef.docs[0].data() as RaceEntry;
          const year = new Date().getFullYear().toString();

          const teamRef = await db
            .collection("Race")
            .doc(year)
            .collection("Teams")
            .where("name", "==", userRaceEntry.team?.toLowerCase())
            .get();

          if (teamRef.size === 0) {
            throw new Error(`No team found ${userRaceEntry.team}!`);
          }

          const team = teamRef.docs[0].data() as Team;
          const teamMembers = team.teamMembers
            ? [...team.teamMembers, session.payment_intent]
            : [session.payment_intent];

          const charge = await stripe.charges.retrieve(
            payment.latest_charge as string
          );
          logger.debug(`charge object`, { charge });
          await Promise.all([
            // slackSendMsg(msg),
            db.collection("StripeEvents").doc(session.id).create(session),
            dbRef.size > 0 &&
              dbRef.docs[0].ref.set(
                {
                  paymentId: session.payment_intent,
                  isPaid: payment.status === "succeeded" ? true : false,
                  receiptNumber: charge?.receipt_number ?? null, // receipt number
                  receiptUrl: charge?.receipt_url ?? null,
                  teamState: "APPROVED",
                  teamId: teamRef.docs[0].ref.id,
                  updatedAt: now,
                },
                { merge: true }
              ),
            teamRef.size > 0 &&
              teamRef.docs[0].ref.set(
                { teamMembers, updatedAt: now },
                { merge: true }
              ),
          ]);
          break;
        }
        default:
      }
      response.status(200).end();
    } catch (error) {
      logger.error(error);
      await slackSendMsg(
        `Failed to process Stripe event! ${JSON.stringify(error)}`
      );
    }
  }
);
