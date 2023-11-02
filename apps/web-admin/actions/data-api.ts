import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";

import { filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import { User } from "@/auth/context";
import { authConfig } from "@/config/server-config";

export async function getAllData(user: User | null) {
  const tokens = await getTokens(cookies(), authConfig);

  console.log(`getall data tokens`, tokens?.decodedToken);
  if (!tokens) {
    throw new Error("Unauthenticated user");
  }
  console.log(`user`, user);

  const [teams, raceEntries, users, freeEntries] = await Promise.all([
    getData("get-teams"),
    getData("get-race-entries"),
    getData("get-users"),
    getData("get-free-entries"),
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

const HOST_URL = process.env.NEXT_PUBLIC_HOST_NAME || "http://localhost:3000";
export async function getData(dataType: string) {
  const res = await fetch(`${HOST_URL}/api/${dataType}`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data;
}
