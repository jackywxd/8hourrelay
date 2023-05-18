import { logger } from "firebase-functions";
import { functions, db } from "../fcm";
import { Team } from "@8hourrelay/models";

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
    const {
      name,
      slogan,
      race,
      email,
    }: {
      name: string;
      slogan: string;
      race: string;
      email: string;
    } = data;

    const year = new Date().getFullYear().toString();
    const now = new Date().getTime();

    if (!name || !race || !email) {
      return { error: `Invalid data!` };
    }

    // verify team name is avaiable first!!
    const teamRef = await db
      .collection("Race")
      .doc(year)
      .collection("Teams")
      .where("name", "==", name)
      .get();
    if (teamRef.size !== 0) {
      return { error: "Team name is taken, please select a new name" };
    }

    const team: Pick<
      Team,
      | "name"
      | "slogan"
      | "captainEmail"
      | "year"
      | "race"
      | "createdAt"
      | "updatedAt"
      | "createdBy"
    > = {
      year,
      race,
      slogan: slogan ?? null,
      name: name,
      captainEmail: email, // set captain emaill to current user's email
      createdBy: context.auth.uid,
      createdAt: now,
      updatedAt: now,
    };

    // no race entry, current user doens't register any race
    // we only create team now
    // check current user already has a team or not??
    // const userRef = await db.collection("Users").doc(context.auth.uid).get();
    // const user = userRef.data() as User;
    await Promise.all([
      db
        .collection("Users")
        .doc(context.auth.uid)
        .set(
          {
            teamYear: `${year}-created`,
            updatedAt: now,
          },
          { merge: true }
        ),
      db
        .collection("Race")
        .doc(year)
        .collection("Teams")
        .doc()
        .set(team, { merge: true }),
    ]);
    return {};

    // // check current user already has a team or not??
    // const raceEntryRef = await db
    //   .collection("Users")
    //   .doc(context.auth.uid)
    //   .collection("RaceEntry")
    //   .where("team", "==", name)
    //   .get();
    // if (raceEntryRef.size !== 0) {
    //   return { error: `User already joined a team. Cannot create team` };
    // }

    // await Promise.all([
    //   slackSendMsg(`New ${race} team ${name} created by ${email}`),
    //   // create Team
    //   db
    //     .collection("Race")
    //     .doc(year)
    //     .collection("Teams")
    //     .doc()
    //     .set(team, { merge: true }),
    //   // update current user's race entry's team name
    //   db
    //     .collection("Users")
    //     .doc(context.auth.uid)
    //     .collection("RaceEntry")
    //     .doc(raceEntry.id)
    //     .set(
    //       {
    //         isCaptain: true, // set this user to captain
    //         team: name, // set the team name
    //       },
    //       { merge: true }
    //     ),
    // ]);
    // return {};
  });
