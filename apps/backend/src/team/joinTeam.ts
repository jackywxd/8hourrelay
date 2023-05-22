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

    logger.info(`Join team for user ${context.auth.uid}`, { data });
    const {
      teamId,
      password,
      raceEntryIds,
    }: {
      teamId: string;
      password: string; // team password
      raceEntryIds: string[]; //raceEntryId 's
    } = data;

    const uid = context.auth.uid;
    const year = new Date().getFullYear().toString();
    const now = new Date().getTime();

    if (!teamId || !password || !raceEntryIds || raceEntryIds.length === 0) {
      return { error: `Invalid data!` };
    }

    // verify team name is avaiable first!!
    const [teamRef, ...racenEntryRefs] = await Promise.all([
      db.collection("Race").doc(year).collection("Teams").doc(teamId).get(),
      ...raceEntryIds.map((raceEntryId) =>
        db
          .collection("Users")
          .doc(uid)
          .collection("RaceEntry")
          .doc(raceEntryId)
          .get()
      ),
    ]);
    if (racenEntryRefs.every((r) => !r.exists) || !teamRef.exists) {
      return { error: `User or race entry not exists or team not exists` };
    }

    const raceEntries = racenEntryRefs.map((f) => f.data()) as RaceEntry[];
    const currentTeam = teamRef.data() as Team;

    if (!currentTeam.isOpen) {
      return { error: `Current team is not open` };
    }

    if (currentTeam.password !== password) {
      return { error: `Incorrect password!` };
    }

    if (raceEntries.every((currentRaceEntry) => !currentRaceEntry.paymentId)) {
      return { error: `Race entry is not paid yet!` };
    }

    if (
      raceEntries.every(
        (currentRaceEntry) =>
          currentRaceEntry.team &&
          currentRaceEntry.teamId &&
          currentRaceEntry.teamState === "APPROVED"
      )
    ) {
      return { error: `Race entry is already joined a team!` };
    }

    if (currentTeam.teamMembers && currentTeam.teamMembers.length >= 24) {
      throw new Error(
        `Team ${currentTeam.name} reach maximum allows team members!`
      );
    }
    const paymentIds = raceEntries.map((f) => f.paymentId!);

    const team: Pick<Team, "teamMembers" | "updatedAt"> = {
      teamMembers: currentTeam.teamMembers
        ? [...currentTeam.teamMembers, ...paymentIds] // we need payment ID here
        : [...paymentIds],
      updatedAt: now,
    };

    await Promise.all([
      ...raceEntryIds.map((raceEntryId) =>
        db
          .collection("Users")
          .doc(uid)
          .collection("RaceEntry")
          .doc(raceEntryId)
          .set(
            {
              teamId,
              team: currentTeam.name,
              teamState: "APPROVED",
              updatedAt: now,
            },
            { merge: true }
          )
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
