import { ServerAuthProvider } from "../../../auth/server-auth-provider";
import { UserProfile } from "./UserProfile";
import { Metadata } from "next";
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";
import { authConfig } from "../../../config/server-config";
import { getFirebaseAdminApp } from "../../firebase";
import { getFirestore } from "firebase-admin/firestore";
import { Badge } from "../../../ui/Badge";
import { HomeLink } from "../../../ui/HomeLink";
import { MainTitle } from "../../../ui/MainTitle";

const db = getFirestore(getFirebaseAdminApp());
async function getUserCounter(): Promise<number> {
  const tokens = await getTokens(cookies(), authConfig);

  if (!tokens) {
    throw new Error("Cannot get counter of unauthenticated user");
  }

  console.log(`decodedtokens`, tokens.decodedToken);

  const snapshot = await db
    .collection("Race")
    .doc("2023")
    .collection("Teams")
    .where("createdBy", "==", tokens.decodedToken.uid)
    .get();

  if (snapshot.empty) {
    return 0;
  }
  const currentUserCounter = await snapshot.docs[0].data();
  console.log(`currentUserCounter`, currentUserCounter);
}

export default async function Profile() {
  const count = await getUserCounter();

  return (
    <div>
      <MainTitle>
        <HomeLink />
        <span>Profile</span>
        <Badge>Rendered on server</Badge>
      </MainTitle>
      {/* @ts-expect-error https://github.com/vercel/next.js/issues/43537 */}
      <ServerAuthProvider>
        <UserProfile count={count} />
      </ServerAuthProvider>
    </div>
  );
}

// Generate customized metadata based on user cookies
// https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export async function generateMetadata(): Promise<Metadata> {
  const tokens = await getTokens(cookies(), authConfig);

  if (!tokens) {
    return {};
  }

  return {
    title: `${tokens.decodedToken.email} profile page | 8 Hour Realy Admin Console`,
  };
}
