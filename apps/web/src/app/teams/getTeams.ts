import { firebaseDb } from "@/firebase/adminConfig";

export async function getTeams() {
  const year = new Date().getFullYear().toString();
  const teamsRef = await firebaseDb
    .collection("Race")
    .doc(year)
    .collection("Teams")
    .where("state", "==", "APPROVED")
    .get();
  if (teamsRef.size > 0) {
    const teams = teamsRef.docs.map((data) => {
      const d = data.data() as Team;
      if (d.state === "APPROVED") {
        const team = { ...d, id: data.id };
        return team;
      }
    });
    return teams;
  }
  console.log(`No teams found`);
  return null;
}
