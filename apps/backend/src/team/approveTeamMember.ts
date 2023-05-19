import { logger } from "firebase-functions";
import { functions, db } from "../fcm";
import { RaceEntry, Team, User } from "@8hourrelay/models";

// API for captain to approve a team member
// the caller must be an captain
export const onManageTeamMember = functions
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
      state,
      paymentId,
      teamId,
    }: {
      state: "APPROVED" | "DENIED";
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

    const currentRaceEntry = racenEntryRef.docs[0].data() as RaceEntry;
    const team = teamRef.data() as Team;
    const user = userRef.data() as User;

    if (team.captainEmail !== user.email) {
      throw new Error(
        `Current login user ${user.email} is not the captain for team ${team.name}`
      );
    }

    if (!currentRaceEntry.paymentId) {
      return { error: `Race entry not paid yet!` };
    }

    if (!team.pendingMembers || !team.pendingMembers.includes(paymentId)) {
      return {
        error: `Failed to find ${paymentId} in team ${team.name} pending members`,
      };
    }

    // remove the item from current pending members array
    const newPendingMembers = team.pendingMembers.filter(
      (f) => f !== paymentId
    );

    if (state === "APPROVED") {
      // approve the new team member, add to the team members array
      if (team.teamMembers && team.teamMembers.length >= 24) {
        throw new Error(`${team.name} reach maximum allows team members!`);
      }
      const newTeamMembers = team.teamMembers
        ? [...team.teamMembers, paymentId]
        : [paymentId];

      await Promise.all([
        racenEntryRef.docs[0].ref.set(
          {
            teamState: state, // approved or denied
            updatedAt: now,
          },
          { merge: true }
        ),
        teamRef.ref.set(
          {
            pendingMembers: newPendingMembers,
            teamMembers: newTeamMembers,
            updatedAt: now,
          },
          { merge: true }
        ),
      ]);
    } else {
      await Promise.all([
        racenEntryRef.docs[0].ref.set(
          {
            teamState: state, // approved or denied
            updatedAt: now,
          },
          { merge: true }
        ),
        teamRef.ref.set(
          {
            pendingMembers: newPendingMembers,
            updatedAt: now,
          },
          { merge: true }
        ),
      ]);
    }
    return {};
  });
