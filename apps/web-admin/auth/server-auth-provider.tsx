import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";
import { AuthProvider } from "./client-auth-provider";
import { authConfig } from "../config/server-config";
import { Tokens } from "next-firebase-auth-edge/lib/auth";
import { User } from "./context";
import { filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import { getTeams } from "@/actions/teams";
import { getRaceEntries } from "@/actions/raceEntries";
import { getUsers } from "@/actions/users";
import { getFreeEntries } from "@/actions/freeEntries";

const mapTokensToUser = ({ decodedToken }: Tokens): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
  } = decodedToken;

  const customClaims = filterStandardClaims(decodedToken);

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    customClaims,
  };
};

export async function ServerAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const tokens = await getTokens(cookies(), authConfig);
  const user = tokens ? mapTokensToUser(tokens) : null;
  let defaultData = {};
  if (user?.customClaims?.role === "admin") {
    const [teams, raceEntries, users, freeEntries] = await Promise.all([
      getTeams(),
      getRaceEntries(),
      getUsers(),
      getFreeEntries(),
    ]);
    defaultData = { teams, raceEntries, users, freeEntries };
  }

  console.log(`defaultData`, defaultData);

  return (
    <AuthProvider defaultUser={user} defaultData={defaultData}>
      {children}
    </AuthProvider>
  );
}
