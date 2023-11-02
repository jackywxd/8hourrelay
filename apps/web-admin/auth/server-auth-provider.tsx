import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";
import { AuthProvider } from "./client-auth-provider";
import { authConfig } from "../config/server-config";
import { Tokens } from "next-firebase-auth-edge/lib/auth";
import { User } from "./context";
import { filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import { getAllData } from "@/actions/data-api";

export const mapTokensToUser = ({ decodedToken }: Tokens): User => {
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

  if (!user) {
    return null;
  }
  const defaultData = await getAllData(user);

  return (
    <AuthProvider defaultUser={user} defaultData={defaultData}>
      {children}
    </AuthProvider>
  );
}
