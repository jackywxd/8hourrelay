import { db, functions, logger } from "../fcm";
import { RaceEntry, User } from "@8hourrelay/models";

export const getAllUsers = functions
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
    logger.info(`list teams incoming data`, { data });
    const usersRef = await db.collection("Users").get();
    if (usersRef.size > 0) {
      const users = usersRef.docs
        .filter((f) => f)
        .map((data) => {
          const d = data.data();
          const user = { ...d, uid: data.id, raceEntries: [] as RaceEntry[] };
          return user as User;
        });
      return users;
    }

    return null;
  });
