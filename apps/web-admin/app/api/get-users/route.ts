import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "@/config/server-config";
import { getFirestore } from "firebase-admin/firestore";
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { getFirebaseAdminApp } from "@/libs/firebase";
import { RaceEntry } from "@8hourrelay/models";

export async function GET(request: NextRequest) {
  const raceEntries = await getUsers();

  return NextResponse.json(raceEntries);
}

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
