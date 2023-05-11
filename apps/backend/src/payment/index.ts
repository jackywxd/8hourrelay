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
    ? "https://staging.8hourrelay.com"
    : "http://localhost:3000";

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
    const session = await stripe.checkout.sessions.retrieve(session_id);
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
    if (context.app == undefined) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called from an App Check verified app."
      );
    }

    logger.info(`Stripe checkout form`, data);

    let customer;
    const {
      uid,
      email,
      race,
      size,
      personalBest,
      firstName,
      lastName,
      preferName,
      phone,
      gender,
      birthYear,
      wechatId,
    }: RaceEntry = data;

    const raceEntry = new RaceEntry(data);
    const userRef = await db.collection("Users").doc(uid).get();
    // user must logged in first to be able to submit this form
    const user = userRef.data() as User;
    if (user.customerId) {
      customer = user.customerId;
    } else {
      const newCustomer = await stripe.customers.create({
        email,
      });
      customer = newCustomer.id;
      await db.collection("Users").doc(uid).set(
        {
          customerId: customer,
        },
        { merge: true }
      );
    }

    try {
      const priceId =
        race === "Adult"
          ? "price_1N1DsLG8aoPJB7f30HPrDn7d" // adules
          : "price_1N46zrG8aoPJB7f378M9cTzb";
      const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
        customer,
        mode: "payment",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${HOST_NAME}/register?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${HOST_NAME}/register?canceled=true`,
        // consent_collection: {
        //   terms_of_service: "required",
        // },
      };

      // Update Stripe customer
      const userObject: any = {};
      if (firstName && lastName) userObject.name = `${firstName} ${lastName}`;
      if (phone) userObject.phone = phone;
      if (Object.keys(userObject).length > 0)
        await stripe.customers.update(customer, userObject);

      const session = await stripe.checkout.sessions.create(
        sessionCreateParams
      );
      if (!session.url) {
        await slackSendText(
          `Failed to create checkout session for email ${email}`
        );
        throw new Error(`Failed to create check out seeions!`);
      }
      raceEntry.sessionId = session.id;

      await Promise.all([
        slackSendText(
          `Checkout session created successfully for email ${email}`
        ),
        db.collection("Users").doc(uid).set(
          {
            firstName,
            lastName,
            preferName,
            gender,
            personalBest,
            phone,
            size,
            birthYear,
            wechatId,
          },
          { merge: true }
        ),
        db
          .collection("Users")
          .doc(uid)
          .collection("RaceEntry")
          .doc(raceEntry.raceId)
          .set(Object.assign({}, raceEntry), { merge: true }),
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
