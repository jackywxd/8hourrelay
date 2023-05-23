import { RaceEntry, Team } from "@8hourrelay/models";
import { firebaseDb } from "@/firebase/adminConfig";

export async function getTeam(name: string) {
  try {
    const decodedName = decodeURI(name);
    const teamsRef = await firebaseDb
      .collection("Race")
      .doc("2023")
      .collection("Teams")
      .where("name", "==", decodedName.toLowerCase())
      .get();

    let team, teamMembers;

    if (teamsRef.size > 0) {
      const teams = teamsRef.docs.map((data) => {
        const team = data.data();
        return { ...team, id: data.id }; // we need the ID for the team
      });

      if (!teams[0]) {
        return null;
      }

      team = new Team(teams[0] as Team);
      if (team && team.teamMembers) {
        const teamMembersPromise = team.teamMembers.map((m) => {
          return firebaseDb
            .collectionGroup("RaceEntry")
            .where("paymentId", "==", m)
            .where("isActive", "==", true)
            .get();
        });
        const teamMembersRef = await Promise.all(teamMembersPromise);
        teamMembers = teamMembersRef.map(
          (ref) => ref.docs[0].data() as RaceEntry
        );
      }
      return { team, teamMembers } as { team: Team; teamMembers: RaceEntry[] };
    }
  } catch (err) {
    console.log(`Failed to query team with name!!`, err);
  }
  console.log(`No teams found`);
  return null;
}

export async function getTeamById(id: string) {
  try {
    const year = new Date().getFullYear().toString();
    const teamsRef = await firebaseDb
      .collection("Race")
      .doc(year)
      .collection("Teams")
      .doc(id)
      .get();

    if (!teamsRef.exists) return null;

    const team = teamsRef.data();
    if (!team) return null;
    return { ...team, id: teamsRef.id } as Team;
  } catch (err) {
    console.log(`Failed to query team with name!!`, err);
  }
  console.log(`No teams found`);
  return null;
}

export async function getTeams(race?: string) {
  const year = new Date().getFullYear().toString();
  const teamsRef = await firebaseDb
    .collection("Race")
    .doc(year)
    .collection("Teams")
    .where("state", "==", "APPROVED")
    .get();
  if (teamsRef.size > 0) {
    const teams = teamsRef.docs
      .filter((f) => f)
      .map((data) => {
        const d = data.data();
        const team = { ...d, id: data.id };
        return team as Team;
      });
    if (race) return teams.filter((f) => f?.race === race);
    return teams;
  }
  console.log(`No teams found`);
  return null;
}
