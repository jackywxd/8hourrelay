import { redirect } from "next/navigation";
import TeamMemberList from "./TeamDetails";
import { getTeam, getTeamById } from "@/firebase/serverApi";
import Link from "next/link";

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
    <div className="flex flex-col w-full items-center">
      <div>
        <h1>Team: {team.displayName}</h1>
      </div>
      <div className="self-end">
        <Link className="link link-primary" href={`/register/${team.name}`}>
          JOIN
        </Link>
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
