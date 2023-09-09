"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/app/firebase";
import { User } from "@8hourrelay/models";

const firebaseDb = getFirestore(getFirebaseAdminApp());

export async function getUsers() {
  if (!firebaseDb) return null;
  const usersRef = await firebaseDb.collection("Users").get();
  if (usersRef.size > 0) {
    const users = usersRef.docs
      .filter((f) => f)
      .map((data) => {
        const d = data.data();
        const user = { ...d, uid: data.id, raceEntries: [] as RaceEntry[] };
        return user;
      });
    return users;
  }
  console.log(`No Usersfound`);
  return null;
}
