import { redirect } from "next/navigation";
import TeamMemberList from "./TeamDetails";
import { getTeam, getTeamById } from "@/firebase/serverApi";
import { Team } from "@8hourrelay/models";
import JoinTeamButton from "./JoinTeamButton";
import ListUserRaceEntries from "./ListUserRaceEntries";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default async function TeamPage({ params }: any) {
  // not team name, just redirect to teams
  if (!params.name) {
    redirect("/teams");
  }

  const [teamName, operation, target] = params.name;
  console.log(teamName, operation, target);

  if (operation && target) {
    const data = await getTeamById(teamName);
    if (!data) {
      return <div>Team {params.name} doesn't exist</div>;
    }
    const team = new Team(data);

    return (
      <div className="flex flex-col w-full min-h-fit justify-center items-center">
        <div className="flex w-full justify-center">
          <h1>
            Join {team.race} Team: {team.displayName}
          </h1>
        </div>
        <div className="divider" />

        <JoinTeamButton id={teamName} raceEntryId={target} />
      </div>
    );
  }
  if (operation === "add") {
    const data = await getTeam(teamName);
    if (!data) {
      return <div>Team {params.name} doesn't exist</div>;
    }
    const { team } = data;

    return (
      <div className="flex flex-col w-full min-h-fit justify-center items-center">
        <div className="flex w-full justify-center">
          <h1>
            {team.race} Team: {team.displayName}
          </h1>
        </div>
        <div className="divider" />
        <div className="flex w-full justify-between"></div>
        <div>
          <Suspense fallback={<Loader />}>
            <ListUserRaceEntries race={team.race} id={team.id} />
          </Suspense>
        </div>
      </div>
    );
  }
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
      <div className="self-end">JOIN</div>
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
