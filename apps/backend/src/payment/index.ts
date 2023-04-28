import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import { slackSendText } from "../../libs/slack";
import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET;
const stripe = new Stripe(apiKey!, {
  apiVersion: "2022-11-15",
  typescript: true,
});
const db = admin.firestore();

export const onCreateCheckout = functions
  .runWith({
    enforceAppCheck: true,
  })
  .https.onCall(async (data, context) => {
    if (context.app === undefined) {
      const rawToken = (context.rawRequest as any).header[
        "X-Firebase-AppCheck"
      ];

      if (rawToken === undefined) {
        logger.debug(`rawToken is undefined`);
      } else {
        // invalid app check token
        await slackSendText(`onBuyNumber received invliad appcheck token!`);
        throw new functions.https.HttpsError(
          "unauthenticated",
          "Provided App Check token failed to validate."
        );
      }
    }
    if (!context.auth || !context.auth.uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Endpoint requires authentication!"
      );
    }

    const user = (
      await db.collection("Users").doc(context.auth.uid).get()
    ).data();

    if (!user) {
      throw new Error(``);
    }

    logger.info(`create check out`, data);
    // number must be an E164 format
    const { email, customerId } = user;

    const priceId = ""; //
    const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
      customer_creation: "if_required",
      customer_email: email,
      customer: customerId ?? undefined,
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${HOST_NAME}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "",
      consent_collection: {
        terms_of_service: "required",
      },
    };

    try {
      const session = await stripe.checkout.sessions.create(
        sessionCreateParams
      );
      return session;
    } catch (error) {
      logger.error(error);
    }
    return null;
  });
