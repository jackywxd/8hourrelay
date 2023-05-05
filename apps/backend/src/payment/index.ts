import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import { slackSendText } from "../libs/slack";
import Stripe from "stripe";
import cors from "cors";
import { Racer } from "@8hourrelay/models";

const db = admin.firestore();

const apiKey = process.env.STRIPE_SECRET;
const stripe = new Stripe(apiKey!, {
  apiVersion: "2022-11-15",
  typescript: true,
});

const HOST_NAME =
  process.env.ENV === "prod"
    ? "http://localhost:3000"
    : "http://localhost:3000";

export const onGetStripeSession = functions.https.onRequest(
  (request: functions.https.Request, response: functions.Response) => {
    cors({ origin: true })(request, response, async () => {
      logger.debug(`request for getStripeSession`, request.body);
      let body,
        data = request.body;
      try {
        body = JSON.parse(data);
      } catch (err) {
        body = data;
      }
      const { session_id } = body;
      const session = await stripe.checkout.sessions.retrieve(session_id);
      logger.debug(`retried session is `, { session });
      response.status(200).send({ email: session.customer_email });
      if (session.customer) {
        const customer = await stripe.customers.retrieve(
          session.customer as string
        );
        logger.debug(`retried customer`, { customer });
      }
    });
  }
);

export const onCreateCheckout = functions.https.onRequest(
  (request: functions.https.Request, response: functions.Response) => {
    cors({ origin: true })(request, response, async () => {
      logger.debug(`request for stripe check out`, request.body);
      let body,
        data = request.body;
      try {
        body = JSON.parse(data);
      } catch (err) {
        body = data;
      }
      let customer;
      const { email, race } = body;

      const userRef = await db.collection("Racers").doc(email).get();
      if (userRef.exists) {
        const user = userRef.data() as Racer;
        if (user.customerId) {
          customer = user.customerId;
        } else {
          const newCustomer = await stripe.customers.create({
            email,
          });
          customer = newCustomer.id;
          await db.collection("Racers").doc(email).set(
            {
              customerId: customer,
            },
            { merge: true }
          );
        }
      } else {
        // create a new Racer
        const newCustomer = await stripe.customers.create({
          email,
        });
        customer = newCustomer.id;
        await db.collection("Racers").doc(email).set(
          {
            email,
            race,
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
          customer_email: email,
          customer,
          mode: "payment",
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          custom_fields: [
            {
              key: "tshirtsize",
              label: {
                type: "custom",
                custom: "Shirt Size",
              },
              optional: false,
              type: "dropdown",
              dropdown: {
                options: [
                  {
                    label: "Small",
                    value: "small",
                  },
                  {
                    label: "Large",
                    value: "large",
                  },
                  {
                    label: "XLarge",
                    value: "xlarge",
                  },
                ],
              },
            },
          ],
          success_url: `${HOST_NAME}/register?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${HOST_NAME}/register?canceled=true`,
          // consent_collection: {
          //   terms_of_service: "required",
          // },
        };

        const session = await stripe.checkout.sessions.create(
          sessionCreateParams
        );
        if (!session.url) {
          await slackSendText(
            `Failed to create checkout session for email ${email}`
          );
          throw new Error(`Failed to create check out seeions!`);
        }
        await Promise.all([
          slackSendText(
            `Checkout session created successfully for email ${email}`
          ),
          db.collection("Racers").doc(email).set(
            {
              session: session.id,
            },
            { merge: true }
          ),
        ]);
        logger.debug(`sending session`, { session });
        response.status(200).send({ id: session.id });
      } catch (error) {
        logger.error(error);
        await slackSendText(
          `Failed to create checkout session for email ${email} ${error}`
        );
        response.status(500).send();
      }
    });
  }
);
