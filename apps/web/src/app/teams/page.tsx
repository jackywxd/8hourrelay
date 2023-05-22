import Link from "next/link";
import { Team } from "@8hourrelay/models";
import { getTeams } from "@/firebase/serverApi";
import DisplayTeams from "./DisplayTeams";

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
  console.log(`all teams data`, { teams });

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex flex-row w-full justify-center mt-10">
        <div className="flex">
          <h1>All teams</h1>
        </div>
      </div>
      <div className="flex self-end link link-primary">
        <Link href="/teams/create">Create Team</Link>
      </div>
      <div className="divider" />
      <div className="items-center w-full">
        <DisplayTeams teams={teams} />
      </div>
    </div>
  );
}
