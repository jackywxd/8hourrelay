/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
import * as functions from "firebase-functions";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { IUser } from "@8hourrelay/store/src/models/User";
import { slackSendText } from "../../libs/slack";

const db = admin.firestore();

const authOnCreate = functions.auth.user().onCreate(async (user, _context) => {
  const now = new Date().getTime();
  try {
    // below are for VpnUsers data
    if (user.email) {
      logger.info(`New User`, user);
      const u: IUser = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: now,
        updatedAt: now,
        phone: user.phoneNumber ?? undefined,
        displayName: user.displayName ?? undefined,
        photoUrl: user.photoURL ?? undefined,
        address: undefined,
        customerId: undefined,
      };

      await Promise.all([
        db.collection("Users").doc(user.uid).set(u, { merge: true }),
        slackSendText(`New user ${user.uid} registered!`),
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
