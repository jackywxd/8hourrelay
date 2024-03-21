import { Metadata } from "next";
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RacenEntriesTable from "@/tables/raceEntries/raceEntriesTable";
import { mapTokensToUser } from "@/auth/server-auth-provider";
import { UserNav } from "@/components/user-nav";
import { getRaceEntries } from "@/actions/data-api";

export async function generateStaticParams() {
  return [{}];
}

export const metadata: Metadata = {
  title: "8 Hour Relay Admin Console",
  description: "Admin Console for 8 Hour Relay",
};

export default async function Home() {
  const data = await getRaceEntries();
  console.log("data", data.length);
  return <RacenEntriesTable data={data} />;
}
