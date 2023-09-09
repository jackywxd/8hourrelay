"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/app/firebase";
import { Race, RaceEntry, Team } from "@8hourrelay/models";

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
