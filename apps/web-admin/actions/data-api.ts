import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";

import { filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import { getTeams } from "@/actions/teams";
import { getRaceEntries } from "@/actions/raceEntries";
import { getUsers } from "@/actions/users";
import { getFreeEntries } from "@/actions/freeEntries";
import { mapTokensToUser } from "@/auth/server-auth-provider";
import { User } from "@/auth/context";

export async function getAllData(user: User | null) {
  console.log(`user`, user);
  const [teams, raceEntries, users, freeEntries] = await Promise.all([
    getTeams(),
    getRaceEntries(),
    getUsers(),
    getFreeEntries(),
  ]);
  teams?.forEach((team) => {
    const raceEntry = raceEntries?.filter((re) => re.teamId === team.id);
    if (raceEntry) {
      team.raceEntries = raceEntry;
    }
  });
  users?.forEach((user) => {
    const raceEntry = raceEntries?.filter((re) => re.uid === user.uid);
    user.raceEntries = raceEntry ? raceEntry : [];
  });

  //   if (user?.customClaims?.role === "admin") {
  return { teams, raceEntries, users, freeEntries };
  //   }
}
