import { firebaseDb } from "@/firebase/adminConfig";
import CreateTeam from "./CreateTeam";
import DisplayTeams from "./DisplayTeams";
import { Team } from "@8hourrelay/models";

async function getTeams() {
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
        const team = new Team({ ...d, id: data.id });
        return team;
      }
    });
    return JSON.stringify(teams);
  }
  console.log(`No teams found`);
  return null;
}

export default async function TeamsPage() {
  const data = await getTeams();

  if (!data) {
    return (
      <div className="flex w-full max-w-lg flex-col items-center">
        <div>Manage team below</div>
        <div className="divider" />
        <div>No team has been created yet</div>
        <div>
          <CreateTeam />
        </div>
      </div>
    );
  }

  const teams = JSON.parse(data);
  return (
    <div className="flex flex-col w-full max-w-lg items-center">
      <div>All teams</div>
      <div className="divider" />
      <DisplayTeams teams={teams} />
      <div>
        <CreateTeam />
      </div>
    </div>
  );
}
