import { logger } from "firebase-functions";
import { slackSendText } from "../libs/slack";
import Stripe from "stripe";
import { RaceEntry, Team, User, event2023 } from "@8hourrelay/models";
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

    // remove teamPassword from raceEntry data
    const { teamPassword, ...raceData } = data;

    if (!raceData.team || !teamPassword) {
      return { error: `Invalid data!` };
    }

    const year = new Date().getFullYear().toString();
    const [userRef, teamRef] = await Promise.all([
      db.collection("Users").doc(uid).get(),
      db
        .collection("Race")
        .doc(year)
        .collection("Teams")
        .where("name", "==", raceData.team.toLowerCase())
        .get(),
    ]);
    if (!userRef.exists || teamRef.size === 0) {
      return { error: `User or team not exists!` };
    }

    const team = { ...teamRef.docs[0].data(), id: teamRef.docs[0].id } as Team;

    if (team.state !== "APPROVED") {
      return { error: `Team is not approved!` };
    }

    if (!team.isOpen) {
      return { error: `Team registration is closed!` };
    }

    if (teamPassword !== team?.password) {
      return { error: `Invalid team password!` };
    }

    const raceEntry = new RaceEntry(raceData as RaceEntry);

    const user = userRef.data() as User;
    customer = user.customerId;
    const email = user.email;

    if (!customer || !email) {
      throw new Error(`User without email and customerId. Invalid data.`);
    }

    let sessionId, payment_intent;
    try {
      const race = event2023.races.filter(
        (r) => r.name === raceEntry.race && r.entryFee === 30
      )[0];

      const isFree = await isFreeEntry(raceEntry);
      if (isFree && isFree.isFree) {
        [payment_intent] = await Promise.all([
          processFreeEntry(user.uid, raceEntry, team),
          db
            .collection("Race")
            .doc(year)
            .collection("FreeEntry")
            .doc(isFree.id)
            .set({ isClaimed: true }, { merge: true }),
        ]);
      } else {
        const priceId =
          raceEntry.race === race?.name
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
          allow_promotion_codes: true,
          success_url: `${HOST_NAME}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${HOST_NAME}/payment?canceled=true`,
        };

        const session = await stripe.checkout.sessions.create(
          sessionCreateParams
        );
        logger.debug(`Created stripe session`, { session });

        // set stripe checkout session ID and payment intent ID
        raceEntry.sessionId = session.id;
        raceEntry.paymentId = session.payment_intent as string;
        sessionId = session.id;
        await Promise.all([
          slackSendText(
            `Checkout session created successfully for email ${email}`
          ),
          raceEntry.id
            ? db
                .collection("Users")
                .doc(uid)
                .collection("RaceEntry")
                .doc(raceEntry.id)
                .set(Object.assign({}, raceEntry), { merge: true }) // Firestore doesn't support object with created via new Class()
            : db
                .collection("Users")
                .doc(uid)
                .collection("RaceEntry")
                .add(Object.assign({}, raceEntry)),
        ]);
      }
      // if the current user and race entry is the same personal, we can update current login user's preference
      if (!raceEntry.isForOther) {
        const {
          firstName,
          lastName,
          preferName,
          gender,
          personalBest,
          phone,
          size,
          birthYear,
          wechatId,
        } = raceEntry;

        // Update Stripe customer
        const userObject: any = {};
        if (firstName && lastName) userObject.name = `${firstName} ${lastName}`;
        if (phone) userObject.phone = phone;
        if (Object.keys(userObject).length > 0) {
          await stripe.customers.update(customer!, userObject);
        }

        await db.collection("Users").doc(uid).set(
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
        );
      }

      if (payment_intent && isFree?.isFree)
        return { id: payment_intent, isFree: true };
      else if (sessionId) return { id: sessionId, isFree: false };
      else throw new Error(`Failed to create checkout session`);
    } catch (error) {
      logger.error(error);
      await slackSendText(
        `Failed to create checkout session for email ${email} ${error}`
      );
    }
    return null;
  });

interface FreeEntry {
  firstName: string;
  lastName: string;
  phone: string;
  isClaimed?: boolean;
}

async function isFreeEntry(raceEntry: RaceEntry) {
  const year = new Date().getFullYear().toString();
  const freeEntriesRef = await db
    .collection("Race")
    .doc(year)
    .collection("FreeEntry")
    .get();

  if (freeEntriesRef.size === 0) return null;

  let isFree = false;
  let id = "";
  freeEntriesRef.docs.forEach((doc) => {
    const entry = doc.data() as FreeEntry;
    if (
      entry.firstName?.toLowerCase() === raceEntry.firstName?.toLowerCase() &&
      entry.lastName?.toLowerCase() === raceEntry.lastName?.toLowerCase() &&
      entry.phone === raceEntry.phone &&
      !entry.isClaimed // free not claimed
    ) {
      isFree = true;
      id = doc.id;
    }
  });
  logger.debug(`isFreeEntry`, { isFree, id });
  return { isFree, id };
}

/*
 * Process free entry
 * Update user's race entry to set the paid flag to true
 * Update team's teamMembers to add the payment intent ID
 */
async function processFreeEntry(uid: string, raceEntry: RaceEntry, team: Team) {
  logger.debug(`processFreeEntry`, { uid, raceEntry, team });
  const year = new Date().getFullYear().toString();
  const now = new Date().getTime();

  // generate payment intent ID by using free-uid-timestamp
  const payment_intent = `free-${uid}-${now}`;

  // add payment intent ID to team members array
  const teamMembers = team.teamMembers
    ? [...team.teamMembers, payment_intent]
    : [payment_intent];

  const msg = `Free ${raceEntry.race} race entry for ${raceEntry.firstName} ${raceEntry.lastName} ${raceEntry.phone} created!`;
  await Promise.all([
    slackSendText(msg),
    raceEntry.id // with id this is an update
      ? db
          .collection("Users")
          .doc(uid)
          .collection("RaceEntry")
          .doc(raceEntry.id)
          .set(
            {
              paymentId: payment_intent,
              isPaid: true,
              teamState: "APPROVED",
              teamId: team.id,
              updatedAt: now,
            },
            { merge: true }
          )
      : db // without id this is a new entry
          .collection("Users")
          .doc(uid)
          .collection("RaceEntry")
          .add({
            ...raceEntry,
            paymentId: payment_intent,
            isPaid: true,
            teamState: "APPROVED",
            teamId: team.id,
            updatedAt: now,
          }),
    db // update team members
      .collection("Race")
      .doc(year)
      .collection("Teams")
      .doc(team.id)
      .set(
        { teamMembers: [...new Set(teamMembers)], updatedAt: now },
        { merge: true }
      ),
  ]);
  return payment_intent;
}
