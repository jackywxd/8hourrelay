"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/app/firebase";
import { RaceEntry } from "@8hourrelay/models";

const firebaseDb = getFirestore(getFirebaseAdminApp());

export async function getRaceEntries() {
  const year = new Date().getFullYear().toString();
  if (!firebaseDb) return null;
  const racesRef = await firebaseDb.collectionGroup("RaceEntry").get();
  if (racesRef.size > 0) {
    const entries = racesRef.docs
      .filter((f) => f)
      .map((data) => {
        const d = data.data();
        const race = { ...d, id: data.id };
        return race as RaceEntry;
      });
    return entries;
  }
  console.log(`No Race Entry found`);
  return null;
}
