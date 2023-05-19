import { logger } from "firebase-functions";
import { functions, db } from "../fcm";
import { Team, User } from "@8hourrelay/models";

// API for captain to remove an approved team member from the team
// the caller must be an captain
export const onRemoveApprovedTeamMember = functions
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

    logger.info(
      `Approve or deny team member from user ${context.auth.uid}`,
      data
    );

    const {
      paymentId,
      teamId,
    }: {
      paymentId: string;
      teamId: string;
    } = data;

    const year = new Date().getFullYear().toString();
    const now = new Date().getTime();

    if (!paymentId) {
      return { error: `Invalid data!` };
    }

    // verify team name is avaiable first!!
    const [userRef, racenEntryRef, teamRef] = await Promise.all([
      db.collection("Users").doc(context.auth.uid).get(),
      db
        .collectionGroup("RaceEntry")
        .where("paymentId", "==", paymentId)
        .where("isActive", "==", true)
        .get(),
      db.collection("Race").doc(year).collection("Teams").doc(teamId).get(),
    ]);

    if (!userRef.exists || racenEntryRef.size === 0 || !teamRef.exists) {
      return { error: `Race entry not exists or team not exists!` };
    }

    const team = teamRef.data() as Team;
    const user = userRef.data() as User;

    if (team.captainEmail !== user.email) {
      throw new Error(
        `Current login user ${user.email} is not the captain for team ${team.name}`
      );
    }

    if (!team.teamMembers || !team.teamMembers.includes(paymentId)) {
      return {
        error: `Failed to find ${paymentId} in team ${team.name} team members array`,
      };
    }

    // remove the item from current pending members array
    const newTeamMembers = team.teamMembers.filter((f) => f !== paymentId);

    await Promise.all([
      racenEntryRef.docs[0].ref.set(
        // reset race entry state!
        {
          team: null,
          teamId: null,
          teamState: null,
          updatedAt: now,
        },
        { merge: true }
      ),
      // update new team members array
      teamRef.ref.set(
        {
          teamMembers: newTeamMembers,
          updatedAt: now,
        },
        { merge: true }
      ),
    ]);
    return {};
  });
