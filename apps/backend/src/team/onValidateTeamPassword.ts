import { logger } from "firebase-functions";
import { functions, db } from "../fcm";
import { Team } from "@8hourrelay/models";

// for team member (race entry) to join a team
// IN: team ID to join; raceEntryId: the team member ID
// if the caller is the captain of the team, no need approval
export const onValidateTeamPassword = functions
  .runWith({
    enforceAppCheck: true,
  })
  .https.onCall(async (data, context) => {
    if (context.app == undefined || !context.auth?.uid) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called from an App Check verified app."
      );
    }

    logger.info(`Validate team password for user ${context.auth.uid}`, {
      data,
    });
    const {
      team,
      teamPassword,
    }: {
      team: string;
      teamPassword: string; // team password
    } = data;

    const year = new Date().getFullYear().toString();

    if (!team || !teamPassword) {
      return { error: `Invalid data!` };
    }

    // verify team name is avaiable first!!
    const teamRef = await db
      .collection("Race")
      .doc(year)
      .collection("Teams")
      .where("name", "==", team)
      .get();

    if (teamRef.size === 0) {
      return false;
    }
    const teamData = teamRef.docs[0].data() as Team;

    if (teamPassword === teamData?.password) {
      return { id: teamRef.docs[0].ref.id };
    }

    return false;
  });
