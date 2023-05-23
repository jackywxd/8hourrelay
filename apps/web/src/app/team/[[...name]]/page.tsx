import { redirect } from "next/navigation";
import TeamMemberList from "./TeamDetails";
import { getTeam, getTeamById } from "@/firebase/serverApi";
import Link from "next/link";
import { Suspense } from "react";

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
  console.log(`team data`, { team, teamMembers });

  if (!team) {
    return (
      <div className="flex flex-col w-full items-center">
        <div className="flex w-full justify-center items-center">
          <h1>Team does not exists</h1>
        </div>
      </div>
    );
  }

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="flex flex-col w-full items-center">
        <div className="flex w-full justify-center items-center">
          <h1>Team {team.name} has no team members yet</h1>
        </div>
      </div>
    );
  }

  if (team.password) {
    delete team.password;
  }

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex w-full justify-center items-center">
        <Suspense fallback={<div>Loading...</div>}>
          <TeamMemberList teamData={team} membersData={teamMembers} />
        </Suspense>
      </div>
    </div>
  );
}
