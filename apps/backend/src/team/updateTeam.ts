import { logger } from "firebase-functions";
import { functions, db } from "../fcm";
import { Team, User } from "@8hourrelay/models";

export const onUpdateTeam = functions
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
    const year = new Date().getFullYear().toString();
    const now = new Date().getTime();

    const { id, name, slogan, isOpen, password } = data as Partial<Team>;

    if (!id) {
      throw new Error(`Team ID is required`);
    }

    const [userRef, teamRef] = await Promise.all([
      db.collection("Users").doc(context.auth.uid).get(),
      db.collection("Race").doc(year).collection("Teams").doc(id).get(),
    ]);

    if (!userRef.exists || !teamRef.exists) {
      return { error: "Team name is taken, please select a new name" };
    }

    const user = userRef.data() as User;
    const teamData = teamRef.data() as Team;

    if (user.email !== teamData.captainEmail) {
      throw new Error(`Request user is not the captain for update team!`);
    }

    const team: Partial<Team> = {};

    if (name) team.name = name;
    if (slogan) team.slogan = slogan;
    if (isOpen !== undefined) team.isOpen = isOpen;
    if (password) team.password = password;
    if (Object.keys(team).length > 0) team.updatedAt = now;

    await Promise.all([
      db
        .collection("Race")
        .doc(year)
        .collection("Teams")
        .doc()
        .set(team, { merge: true }),
    ]);
    return {};
  });
