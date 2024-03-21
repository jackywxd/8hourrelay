import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "@/config/server-config";
import { getFirestore } from "firebase-admin/firestore";
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { getFirebaseAdminApp } from "@/libs/firebase";
import { RaceEntry } from "@8hourrelay/models";

export async function GET(request: NextRequest) {
  console.log(`getting race entries`, request);
  const raceEntries = await getTeams();

  console.log(`result: ${JSON.stringify(raceEntries)}`);
  return NextResponse.json(raceEntries);
}

const firebaseDb = getFirestore(getFirebaseAdminApp());

export async function getTeams() {
  const year = new Date().getFullYear().toString();
  if (!firebaseDb) return null;
  const teamsRef = await firebaseDb
    .collection("Race")
    .doc(year)
    .collection("Teams")
    .get();
  if (teamsRef.size > 0) {
    const teams = teamsRef.docs
      .filter((f) => f)
      .map((data) => {
        const d = data.data();
        const team = { ...d, id: data.id, raceEntries: [] as RaceEntry[] };
        return team;
      });
    return teams;
  }
  console.log(`No teams found`);
  return null;
}
