import { Team } from "@8hourrelay/models";
import { admin, functions, logger, db } from "../fcm";
import { slackActionSend } from "../libs/slack";

const increment = admin.firestore.FieldValue.increment(1);

export const onTeamCreated = functions.firestore
  .document("Race/{year}/Teams/{teamId}")
  .onCreate(async (snapshot, context) => {
    const team = snapshot.data() as Team;

    logger.debug("New Team Data", { team, context });
    try {
      const year = new Date().getFullYear().toString();
      await Promise.all([
        db.collection("Race").doc(year).set(
          {
            totalTeam: increment,
            updatedAt: new Date().getTime(),
          },
          { merge: true }
        ),
        slackActionSend(
          `New ${team.race} team name: ${team.name} created by ${team.captainEmail} uid ${team.createdBy}`,
          snapshot.id, // team ID
          team.createdBy // user ID
        ),
      ]);
    } catch (err) {
      logger.error(`Failed to update db`, { err });
    }
  });
