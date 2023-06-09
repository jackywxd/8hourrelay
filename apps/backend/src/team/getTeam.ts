import { db, functions, logger } from "../fcm";
import { Team } from "@8hourrelay/models";

export const onGetTeam = functions
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
    logger.info(`get team incoming data`, { data });
    const { teamId } = data;
    if (!teamId) {
      throw new Error(`Invalid data`);
    }
    const year = new Date().getFullYear().toString();

    const teamRef = await db
      .collection("Race")
      .doc(year)
      .collection("Teams")
      .doc(teamId)
      .get();

    if (!teamRef.exists) {
      throw new Error(`Team not exists`);
    }
    const team = teamRef.data() as Team;
    logger.debug(`Returning team data`, { team });
    return team;
  });
