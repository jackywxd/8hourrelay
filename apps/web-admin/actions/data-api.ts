import admin from "firebase-admin";

import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";
import { filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import { User } from "@/auth/context";
import { authConfig } from "@/config/server-config";
import { getFirebaseAdminApp } from "@/libs/firebase";

export async function listAllUsers(limit = 100, nextToken?: string) {
  try {
    const app = await getFirebaseAdminApp();
    const listUsers = await app.auth().listUsers(limit, nextToken);
    const users = listUsers.users.map(mapUser);
    return { users, nextPageToken: listUsers.pageToken };
  } catch (err) {
    console.log(`error`, err);
  }
}

function mapUser(user: admin.auth.UserRecord) {
  const customClaims = (user.customClaims || { role: "" }) as { role?: string };
  const role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
}

export async function getRaceEntries() {
  const tokens = await getTokens(cookies(), authConfig);

  if (!tokens) {
    throw new Error("Unauthenticated user");
  }
  const entries = await getData("get-race-entries");
  // console.log(`entries`, entries);
  return entries;
}

export async function getAllData(user: User) {
  const tokens = await getTokens(cookies(), authConfig);

  console.log(`getall data tokens`, tokens?.decodedToken);
  if (!tokens) {
    return null;
    // throw new Error("Unauthenticated user");
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
  users?.forEach((u) => {
    const raceEntry = raceEntries?.filter((re) => re.uid === u.uid);
    u.raceEntries = raceEntry ? raceEntry : [];
  });

  //   if (user?.customClaims?.role === "admin") {
  return { teams, raceEntries, users, freeEntries };
  //   }
}

const HOST_URL = "http://localhost:3001";
export async function getData(dataType: string) {
  const tokens = await getTokens(cookies(), authConfig);

  console.log(`get data tokens`, tokens?.token);
  const res = await fetch(`${HOST_URL}/api/${dataType}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokens?.token}`,
    },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data;
}
