import { db as firebaseDb, functions } from "../fcm";
import { RaceEntry } from "@8hourrelay/models";

export const getAllRaceEntries = functions
  .runWith({
    enforceAppCheck: true,
  })
  .https.onCall(async () => {
    const racesRef = await firebaseDb.collectionGroup("RaceEntry").get();
    if (racesRef.size > 0) {
      const emailPromises = [] as { index: number; promise: any }[];
      const entries = racesRef.docs
        .filter((f) => f)
        .map((data, index) => {
          const d = data.data();
          const race = { ...d, id: data.id } as RaceEntry;
          if (!race.email) {
            emailPromises.push({
              index,
              promise: data.ref.parent.parent?.get(),
            });
          }
          return race as RaceEntry;
        });
      if (emailPromises.length > 0) {
        const emailResults = await Promise.allSettled(
          emailPromises.map((p) => p.promise)
        );
        emailResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            entries[emailPromises[index].index].email =
              result.value.data().email;
          }
        });
      }

      return entries;
    }
    console.log(`No Race Entry found`);
    return null;
  });

export default getAllRaceEntries;
