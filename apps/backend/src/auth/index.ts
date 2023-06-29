/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import { logger } from "firebase-functions";
import { User } from "@8hourrelay/models";
import { slackSendText } from "../libs/slack";

const db = admin.firestore();
const apiKey = process.env.STRIPE_SECRET;
const stripe = new Stripe(apiKey!, {
  apiVersion: "2022-11-15",
  typescript: true,
});

const authOnCreate = functions.auth.user().onCreate(async (user, _context) => {
  const now = new Date().getTime();
  try {
    const { email } = user;
    // below are for VpnUsers data
    if (user.email) {
      logger.info(`New User`, user);
      const u: Omit<User, "displayName" | "name"> = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: now,
        updatedAt: now,
        phone: user.phoneNumber ?? undefined,
        image: user.photoURL ?? undefined,
        address: undefined,
        preferName: undefined,
        firstName: undefined,
        lastName: undefined,
        wechatId: undefined,
        gender: undefined,
        birthYear: undefined,
        personalBest: undefined,
        emergencyName: undefined,
        emergencyPhone: undefined,
        customerId: undefined,
      };
      // create a new customer in Stripe
      const newCustomer = await stripe.customers.create({
        email,
      });
      u.customerId = newCustomer.id;
      await Promise.all([
        db.collection("Users").doc(user.uid).set(u, { merge: true }),
        slackSendText(`New user ${user.email} registered!`),
      ]);
      return null;
    }
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to create user`, err);
    await slackSendText(`Failed to create user! Error: ${err.message}`);
  }
  return null;
});

export { authOnCreate };
