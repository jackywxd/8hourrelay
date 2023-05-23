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
      captainName,
      slogan,
      race,
      password,
      email,
    }: {
      name: string; // team name
      captainName: string; //team captain name
      slogan: string;
      race: string;
      email: string;
      password: string;
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
      .where("name", "==", name.toLowerCase())
      .get();

    if (teamRef.size !== 0) {
      return { error: "Team name is taken, please select a new name" };
    }

    const team: Partial<Team> = {
      year,
      race,
      password,
      slogan: slogan ?? null,
      isOpen: true,
      captainName, // set captain name
      name: name.toLowerCase(),
      captainEmail: email, // set captain emaill to current user's email
      createdBy: context.auth.uid,
      createdAt: now,
      updatedAt: now,
    };

    // no race entry, current user doens't register any race
    // we only create team now
    await Promise.all([
      db
        .collection("Users")
        .doc(context.auth.uid)
        .set(
          {
            teamYear: `${year}-INIT`,
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
  });
