import { redirect } from "next/navigation";

import { RaceEntry, Team } from "@8hourrelay/models";
import { firebaseDb } from "@/firebase/adminConfig";
import TeamMemberList from "./TeamDetails";

async function getTeam(name: string) {
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
          (ref) => new RaceEntry(ref.docs[0].data() as RaceEntry)
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

export default async function TeamPage({ params }: any) {
  // not team name, just redirect to teams
  if (!params.name) {
    redirect("/teams");
  }

  const [teamName, operation, target] = params.name;
  console.log(teamName, operation, target);
  const data = await getTeam(teamName);
  if (!data) {
    return <div>Team {params.name} doesn't exist</div>;
  }
  const { team, teamMembers } = data;

  return (
    <div className="flex flex-col w-full min-h-fit justify-center items-center">
      <div className="flex w-full justify-center">
        <h1>Team: {team.displayName}</h1>
      </div>
      <div className="divider" />
      <div className="flex w-full justify-between">
        <h1>Race: {team.race}</h1>
        {team.slogan && <h2>{team.slogan}</h2>}
        <h1>Captain: {team.captainEmail}</h1>
      </div>
      <div className="divider">Team Members</div>
      <div className="flex w-full justify-center items-center">
        {teamMembers ? (
          <TeamMemberList
            captainEmail={team.captainEmail}
            members={teamMembers}
          />
        ) : null}
      </div>
    </div>
  );
}
