import { logger } from "firebase-functions";
import { functions, db } from "../fcm";
import { RaceEntry, Team, User } from "@8hourrelay/models";

export const onCreateTeam = functions
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

    logger.info(`Create team for user ${context.auth.uid}`, data);
    const { teamName, slogan, year, raceId } = data;
    const now = new Date().getTime();
    if (!teamName) {
      throw new Error(`Invalid data!!`);
    }

    // verify team name is avaiable first!!
    const teamRef = await db
      .collection("Race")
      .doc(year)
      .collection("Teams")
      .doc(teamName)
      .get();
    if (teamRef.exists) {
      throw new Error(`Team name is taken`);
    }
    // no race ID, current user doens't register any race
    // we only create team now
    if (!raceId) {
      // check current user already has a team or not??
      const userRef = await db.collection("Users").doc(context.auth.uid).get();
      const user = userRef.data() as User;
      await db
        .collection("Race")
        .doc(year)
        .collection("Teams")
        .doc(teamName)
        .set(
          {
            name: teamName,
            captainEmail: user.email,
            createdBy: user.email,
            slogan: slogan ?? null,
            createdAt: now,
            updatedAt: now,
          },
          { merge: true }
        );
      return;
    }

    // check current user already has a team or not??
    const userRef = await db
      .collection("Users")
      .doc(context.auth.uid)
      .collection("RaceEntry")
      .doc(raceId)
      .get();
    // user must logged in first to be able to submit this form
    const raceEntry = userRef.data() as RaceEntry;

    if (raceEntry.team) {
      throw new Error(`User already joined a team. Cannot create team`);
    }

    const { email, race } = raceEntry;

    const team: Pick<
      Team,
      | "name"
      | "slogan"
      | "captainEmail"
      | "year"
      | "race"
      | "teamMembers"
      | "createdAt"
      | "updatedAt"
      | "createdBy"
    > = {
      slogan,
      year,
      race,
      name: teamName,
      captainEmail: email, // set captain emaill to current user's email
      createdBy: email,
      teamMembers: [raceEntry], // add current team member
      createdAt: now,
      updatedAt: now,
    };

    await Promise.all([
      // create Team
      db
        .collection("Race")
        .doc(year)
        .collection("Teams")
        .doc(teamName)
        .set(team, { merge: true }),
      // update current user's race entry's team name
      db
        .collection("Users")
        .doc(context.auth.uid)
        .collection("RaceEntry")
        .doc(raceId)
        .set(
          {
            isCaptain: true, // set this user to captain
            team: teamName, // set the team name
          },
          { merge: true }
        ),
    ]);
  });
