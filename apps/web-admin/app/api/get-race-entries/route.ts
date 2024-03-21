import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "@/config/server-config";
import { getFirestore } from "firebase-admin/firestore";
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { getFirebaseAdminApp } from "@/libs/firebase";
import { RaceEntry } from "@8hourrelay/models";

export async function GET(request: NextRequest) {
  // const tokens = await getTokens(request.cookies, authConfig);

  // console.log(`get data tokens`, tokens?.decodedToken);
  // if (!tokens) {
  //   throw new Error("Cannot update counter of unauthenticated user");
  // }

  console.log(`getting race entries`);
  const raceEntries = await getAllRaceEntries();

  // console.log(`result: ${JSON.stringify(raceEntries)}`);
  return NextResponse.json(raceEntries);
}

const getAllRaceEntries = async () => {
  const db = getFirestore(getFirebaseAdminApp());
  const racesRef = await db.collectionGroup("RaceEntry").get();
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
          entries[emailPromises[index].index].email = result.value.data().email;
        }
      });
    }

    return entries;
  }
  console.log(`No Race Entry found`);
  return [];
};
