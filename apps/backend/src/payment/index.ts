import { logger } from "firebase-functions";
import { slackSendText } from "../libs/slack";
import Stripe from "stripe";
import { RaceEntry, User } from "@8hourrelay/models";
import { db, functions } from "../fcm";

const apiKey = process.env.STRIPE_SECRET;
const stripe = new Stripe(apiKey!, {
  apiVersion: "2022-11-15",
  typescript: true,
});

const HOST_NAME =
  process.env.ENV === "prod"
    ? "https://8hourrelay.com"
    : process.env.ENV === "staging"
    ? "http://localhost:3000"
    : "https://staging.8hourrelay.com";

export const onGetStripeSession = functions
  .runWith({
    enforceAppCheck: true,
  })
  .https.onCall(async (data, context) => {
    // context.app will be undefined if the request doesn't include an
    // App Check token. (If the request includes an invalid App Check
    // token, the request will be rejected with HTTP error 401.)
    if (context.app == undefined) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called from an App Check verified app."
      );
    }

    logger.info(`Stripe checkout form`, data);
    const { session_id } = data;
    const [session, raceRef] = await Promise.all([
      stripe.checkout.sessions.retrieve(session_id),
      db
        .collectionGroup("RaceEntry")
        .where("sessionId", "==", session_id)
        .where("isActive", "==", true)
        .get(),
    ]);

    if (session && raceRef.size > 0) {
      raceRef.docs[0].ref.set({
        paymentId: session.payment_intent,
        isPaid: true,
      });
    }
    logger.debug(`retried session is `, { session });
    return { email: session.customer_email };
  });

export const onCreateCheckout = functions
  .runWith({
    enforceAppCheck: true,
  })
  .https.onCall(async (data, context) => {
    // context.app will be undefined if the request doesn't include an
    // App Check token. (If the request includes an invalid App Check
    // token, the request will be rejected with HTTP error 401.)
    if (context.app == undefined || !context.auth?.uid) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called from an App Check verified app."
      );
    }

    logger.info(`Stripe checkout form`, data);

    const uid = context.auth.uid;

    let customer;
    const { id, race }: RaceEntry = data;

    const raceEntry = new RaceEntry(data);
    // user must logged in first to be able to submit this form

    const userRef = await db.collection("Users").doc(uid).get();
    const user = userRef.data() as User;
    customer = user.customerId;
    const email = user.email;

    try {
      const priceId =
        race === "Adult"
          ? process.env.PRICE_ID_ADULT // adules
          : process.env.PRICE_ID_KIDS;

      const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
        customer,
        mode: "payment",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${HOST_NAME}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${HOST_NAME}/payment?canceled=true`,
        // consent_collection: {
        //   terms_of_service: "required",
        // },
      };

      // Update Stripe customer
      // const userObject: any = {};
      // if (firstName && lastName) userObject.name = `${firstName} ${lastName}`;
      // if (phone) userObject.phone = phone;
      // if (Object.keys(userObject).length > 0)
      //   await stripe.customers.update(customer, userObject);

      const session = await stripe.checkout.sessions.create(
        sessionCreateParams
      );
      logger.debug(`Created stripe session`, { session });
      // if (!session.url) {
      //   await slackSendText(
      //     `Failed to create checkout session for email ${email}`
      //   );
      //   throw new Error(`Failed to create check out seeions!`);
      // }

      // set stripe checkout session ID and payment intent ID
      raceEntry.sessionId = session.id;
      raceEntry.paymentId = session.payment_intent as string;

      await Promise.all([
        slackSendText(
          `Checkout session created successfully for email ${email}`
        ),
        // db.collection("Users").doc(uid).set(
        //   {
        //     firstName,
        //     lastName,
        //     preferName,
        //     gender,
        //     personalBest,
        //     phone,
        //     size,
        //     birthYear,
        //     wechatId,
        //   },
        //   { merge: true }
        // ),
        id
          ? db
              .collection("Users")
              .doc(uid)
              .collection("RaceEntry")
              .doc(id)
              .set(Object.assign({}, raceEntry), { merge: true })
          : db
              .collection("Users")
              .doc(uid)
              .collection("RaceEntry")
              .add(Object.assign({}, raceEntry)),
      ]);
      logger.debug(`sending session`, { session });
      return { id: session.id };
    } catch (error) {
      logger.error(error);
      await slackSendText(
        `Failed to create checkout session for email ${email} ${error}`
      );
    }
    return null;
  });
