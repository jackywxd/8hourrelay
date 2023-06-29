import TeamMemberList from "./TeamDetails";
import { getTeam } from "@/firebase/serverApi";
import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import Link from "next/link";

export default async function TeamPage({ teamName }: { teamName: string }) {
  // not team name, just redirect to teams
  const data = await getTeam(teamName);
  if (!data) {
    return <div>Team {teamName} doesn't exist</div>;
  }
  const { team, teamMembers } = data;
  console.log(`team data`, { team, teamMembers });

  if (!team) {
    return (
      <>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="close" className="text-red-500" />
          <EmptyPlaceholder.Title>
            Cannot find team {decodeURI(teamName)}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Please double check your team name
          </EmptyPlaceholder.Description>
          <Link href="/team">
            <Button variant="outline">OK</Button>
          </Link>
        </EmptyPlaceholder>
      </>
    );
  }

  if (team.password) {
    delete team.password;
  }

  return <TeamMemberList teamData={team} membersData={teamMembers} />;
}
