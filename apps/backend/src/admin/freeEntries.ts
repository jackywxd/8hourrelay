import { FreeEntry } from "@8hourrelay/models";
import { db, functions } from "../fcm";

export const getAllFreeEntries = functions
  .runWith({
    enforceAppCheck: true,
  })
  .https.onCall(async (data) => {
    const year = data.year ?? new Date().getFullYear().toString();
    const teamsRef = await db
      .collection("Race")
      .doc(year)
      .collection("FreeEntry")
      .get();
    if (teamsRef.size > 0) {
      const teams = teamsRef.docs
        .filter((f) => f)
        .map((data) => {
          const d = data.data();
          const team = { ...d, id: data.id };
          return team as FreeEntry;
        });
      return teams;
    }
    console.log(`No Free Entry found`);
    return null;
  });

export default getAllFreeEntries;
