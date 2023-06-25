import { redirect } from "next/navigation";
import TeamMemberList from "./TeamDetails";
import { getTeam } from "@/firebase/serverApi";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import "@/styles/teams.css";
import "@/styles/form.css";

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

  if (team.password) {
    delete team.password;
  }

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex w-full justify-center items-center">
        <Suspense fallback={Loader}>
          <TeamMemberList teamData={team} membersData={teamMembers} />
        </Suspense>
      </div>
    </div>
  );
}
