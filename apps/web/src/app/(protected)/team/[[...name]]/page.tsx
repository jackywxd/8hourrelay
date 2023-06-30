import { redirect } from "next/navigation";
import AllTeamsPage from "./AllTeams";
import ShowTeam from "./ShowTeam";
import CreateTeam from "./CreateTeam";
interface PageProps {
  params: {
    name: string[];
  };
}

export default async function TeamPage({ params }: PageProps) {
  // not team name, just redirect to teams
  if (!params.name) {
    return <AllTeamsPage />;
  }
  const action = params.name[0];
  if (action === "create") {
    return <CreateTeam />;
  }

  const team = params.name[1];
  if (!team) {
    redirect("/team");
  }
  if (action === "show" && team) {
    return <ShowTeam teamName={team} />;
  }
}
