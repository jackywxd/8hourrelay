import DisplayTeams from "./DisplayTeams";
import { Team } from "@8hourrelay/models";
import Link from "next/link";
import { getTeams } from "./getTeams";

export default async function TeamsPage() {
  const data = await getTeams();

  if (!data) {
    return (
      <div className="flex w-full max-w-lg flex-col items-center">
        <div>Manage team below</div>
        <div className="divider" />
        <div>No team has been created yet</div>
        <div className="link link-primary">
          <Link href="/teams/create">Create Team Now</Link>
        </div>
      </div>
    );
  }

  const teams = data as Team[];

  return (
    <div className="flex flex-col w-full h-full max-w-lg justify-center items-center">
      <div className="flex flex-row w-full justify-center ">
        <div className="flex">
          <h1>All teams</h1>
        </div>
      </div>
      <div className="flex self-end link link-primary">
        <Link href="/teams/create">Create Team</Link>
      </div>
      <div className="divider" />
      <DisplayTeams teams={teams} />
    </div>
  );
}
