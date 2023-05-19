import { logger } from "firebase-functions";
import { functions, db } from "../fcm";
import { RaceEntry, Team } from "@8hourrelay/models";

// for team member (race entry) to join a team
// IN: team ID to join; raceEntryId: the team member ID
// if the caller is the captain of the team, no need approval
export const onJoinTeam = functions
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

    logger.info(`Join team for user ${context.auth.uid}`, data);
    const {
      teamId,
      password,
      raceEntryId,
    }: {
      teamId: string;
      password: string; // team password
      raceEntryId: string;
    } = data;

    const year = new Date().getFullYear().toString();
    const now = new Date().getTime();

    if (!teamId || !raceEntryId) {
      return { error: `Invalid data!` };
    }

    // verify team name is avaiable first!!
    const [userRef, racenEntryRef, teamRef] = await Promise.all([
      db.collection("Users").doc(context.auth.uid).get(),
      db
        .collection("Users")
        .doc(context.auth.uid)
        .collection("RaceEntry")
        .doc(raceEntryId)
        .get(),
      db.collection("Race").doc(year).collection("Teams").doc(teamId).get(),
    ]);
    if (!userRef.exists || !racenEntryRef.exists || !teamRef.exists) {
      return { error: `User or race entry not exists or team not exists` };
    }

    const currentRaceEntry = racenEntryRef.data() as RaceEntry;
    const user = userRef.data() as RaceEntry;
    const currentTeam = teamRef.data() as Team;

    if (!currentTeam.isOpen) {
      return { error: `Current team is not open` };
    }

    if (currentTeam.password !== password) {
      return { error: `Incorrect password!` };
    }

    if (!currentRaceEntry.paymentId) {
      return { error: `Race entry ${raceEntryId} is not paid yet!` };
    }
    if (
      currentRaceEntry.team &&
      currentRaceEntry.teamId &&
      currentRaceEntry.teamState === "APPROVED"
    ) {
      return { error: `Race entry ${raceEntryId} is already APPROVED!` };
    }

    // if the current user is the captain of the target team, he can add team member without approval
    if (user.email == currentTeam.captainEmail) {
      if (currentTeam.teamMembers && currentTeam.teamMembers.length >= 24) {
        throw new Error(
          `Team ${currentTeam.name} reach maximum allows team members!`
        );
      }

      const team: Pick<Team, "teamMembers" | "updatedAt"> = {
        teamMembers: currentTeam.teamMembers
          ? [...currentTeam.teamMembers, currentRaceEntry.paymentId] // we need payment ID here
          : [currentRaceEntry.paymentId],
        updatedAt: now,
      };

      await Promise.all([
        db
          .collection("Users")
          .doc(context.auth.uid)
          .collection("RaceEntry")
          .doc(raceEntryId)
          .set(
            {
              team: currentTeam.name,
              teamId: teamRef.id,
              teamState: "APPROVED",
              updatedAt: now,
            },
            { merge: true }
          ),
        db
          .collection("Race")
          .doc(year)
          .collection("Teams")
          .doc(teamId)
          .set(team, { merge: true }),
      ]);
      return {};
    }

    const team: Pick<Team, "pendingMembers" | "updatedAt"> = {
      pendingMembers: currentTeam.pendingMembers
        ? [...currentTeam.pendingMembers, currentRaceEntry.paymentId] // we need payment ID here
        : [currentRaceEntry.paymentId],
      updatedAt: now,
    };

    await Promise.all([
      db
        .collection("Users")
        .doc(context.auth.uid)
        .collection("RaceEntry")
        .doc(raceEntryId)
        .set(
          {
            team: currentTeam.name,
            teamId: teamRef.id,
            teamState: "PENDING",
            updatedAt: now,
          },
          { merge: true }
        ),
      db
        .collection("Race")
        .doc(year)
        .collection("Teams")
        .doc(teamId)
        .set(team, { merge: true }),
    ]);
    return {};
  });
