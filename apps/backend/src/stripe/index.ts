import { slackSendMsg } from "../libs/slack";
import Stripe from "stripe";
import { logger, db, functions } from "../fcm";

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

      switch (type) {
        case "payment_intent.succeeded": {
          const paymentIntent = object as Stripe.PaymentIntent;
          const msg = `🔔  Webhook received! Payment for PaymentIntent ${paymentIntent.id} succeeded.`;
          logger.info(msg);
          const email = paymentIntent.receipt_email;
          const userSnapshot = await db
            .collectionGroup("RaceEntry")
            .where("email", "==", email)
            .where("isActive", "==", true)
            .get();
          if (userSnapshot.size === 0) {
            throw new Error(`Could not find this customer ${email}`);
          }
          // const data = userSnapshot.docs[0].data();
          // payment intent completed, update user and transaction data
          await Promise.all([
            slackSendMsg(msg),
            db
              .collection("StripeEvents")
              .doc(paymentIntent.id)
              .create(paymentIntent),
            userSnapshot.docs[0].ref.set(
              {
                paymentId: paymentIntent.id,
              },
              { merge: true }
            ),
          ]);
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
          const email = charge.receipt_email;
          const userSnapshot = await db
            .collectionGroup("RaceEntry")
            .where("email", "==", email)
            .where("isActive", "==", true)
            .get();
          if (userSnapshot.size === 0) {
            throw new Error(`Could not find this customer ${email}`);
          }
          await Promise.all([
            slackSendMsg(msg),
            db.collection("StripeEvents").doc(charge.id).create(charge),
            userSnapshot.docs[0].ref.set(
              {
                receiptNumber: charge.receipt_number, // receipt number
                receiptUrl: charge.receipt_url,
                isPaid: true, // set paid to true
              },
              { merge: true }
            ),
          ]);
          break;
        }
        case "checkout.session.completed": {
          const session = object as Stripe.Checkout.Session;
          const msg = `🔔  Session ${session.customer_email} completed!`;
          logger.info(msg);
          await Promise.all([
            slackSendMsg(msg),
            db.collection("StripeEvents").doc(session.id).create(session),
          ]);
          break;
        }
        default:
      }
      response.status(200).end();
    } catch (error) {
      logger.error(error);
    }
    return;
  }
);
