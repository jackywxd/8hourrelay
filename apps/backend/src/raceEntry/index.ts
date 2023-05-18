import { RaceEntry } from "@8hourrelay/models";
import { admin, db, functions, logger } from "../fcm";
import { slackSendMsg } from "../libs/slack";

const increment = admin.firestore.FieldValue.increment(1);

export const onRaceEntryCreated = functions.firestore
  .document("Users/{uid}/RaceEntry/{raceEntryId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data() as RaceEntry;
    const raceEntry = new RaceEntry(data);
    logger.debug("Race Entry data", { data, context });
    try {
      const year = new Date().getFullYear().toString();
      await Promise.all([
        slackSendMsg(
          `User ${raceEntry.displayName} ${raceEntry.email} registered for race ${raceEntry.race}`
        ),
        db.collection("Race").doc(year).set(
          {
            totalRunner: increment,
          },
          { merge: true }
        ),
      ]);
    } catch (err) {
      logger.error(`Failed to update db`, { err });
    }
  });

export const onRaceEntryUpdate = functions.firestore
  .document("Users/{uid}/RaceEntry/{raceEntryId}")
  .onUpdate(async (snapshot, context) => {
    const data = snapshot.after.data() as RaceEntry;
    const oldData = snapshot.before.data() as RaceEntry;
    logger.debug("Race Entry data", { data, oldData, context });
    try {
      if (data.isPaid !== oldData.isPaid && data.isPaid) {
        const raceEntry = new RaceEntry(data);
        const year = new Date().getFullYear().toString();
        await Promise.all([
          slackSendMsg(
            `User ${raceEntry.displayName} ${raceEntry.email} paid for race ${raceEntry.race}. Registration completed!`
          ),
          db.collection("Race").doc(year).set(
            {
              totalPaid: increment,
            },
            { merge: true }
          ),
        ]);
      }
    } catch (err) {
      logger.error(`Failed to update db`, { err });
    }
  });
