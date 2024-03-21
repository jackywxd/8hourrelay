import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "@/config/server-config";
import { getFirestore } from "firebase-admin/firestore";
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { getFirebaseAdminApp } from "@/libs/firebase";
import { FreeEntry } from "@8hourrelay/models";

export async function GET(request: NextRequest) {
  const raceEntries = await getFreeEntries();

  return NextResponse.json(raceEntries);
}

const firebaseDb = getFirestore(getFirebaseAdminApp());

export async function getFreeEntries() {
  const year = new Date().getFullYear().toString();
  if (!firebaseDb) return null;
  const teamsRef = await firebaseDb
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
}
