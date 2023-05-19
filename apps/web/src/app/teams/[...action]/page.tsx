import { RaceEntry, Team } from "@8hourrelay/models";
import { firebaseDb } from "@/firebase/adminConfig";
import Link from "next/link";
import TeamMemberList from "./TeamDetails";
import CreateTeam from "./CreateTeam";
import { redirect } from "next/navigation";
import DisplayTeams from "../DisplayTeams";
import { getTeams } from "../getTeams";

async function getRaceEntry(uid: string, id: string) {
  try {
    const raceEntryRef = await firebaseDb
      .collection("Users")
      .doc(uid)
      .collection("RaceEntry")
      .doc(id)
      .get();

    if (raceEntryRef.exists) {
      const entry = new RaceEntry(raceEntryRef.data() as RaceEntry);
      return entry;
    }
  } catch (err) {
    console.log(`Failed to query team with name!!`, err);
  }
  console.log(`No teams found`);
  return null;
}

export default async function TeamPage({ params }: any) {
  const [action, target] = params.action;

  console.log("Teams Action target", action, target);

  if (!action) {
    redirect("/teams");
  }

  if (action === "join" && target) {
    const [uid, id] = target.split("-");
    if (uid && id) {
      const [raceEntry, teams] = await Promise.all([
        getRaceEntry(uid, id),
        getTeams(),
      ]);
      console.log(`incomign raceEntry is`, { raceEntry, teams });
      return (
        <div className="flex flex-col w-full min-h-fit justify-center items-center">
          <div className="flex w-full justify-center">
            <h1>Team Action is: {action} </h1>
            {target && <h1>Target is {target}</h1>}
          </div>
          <DisplayTeams teams={teams} />
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col w-full min-h-fit justify-center items-center">
      <div className="flex w-full justify-center">
        <h1>Team Action is: {action} </h1>
        {target && <h1>Target is {target}</h1>}
      </div>
      {action === "create" && <CreateTeam />}
    </div>
  );
}
