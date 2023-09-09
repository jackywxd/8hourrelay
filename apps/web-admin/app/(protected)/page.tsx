import { Metadata } from "next";
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RacenEntriesTable from "@/raceEntries/raceEntriesTable";
import { mapTokensToUser } from "@/auth/server-auth-provider";
import { UserNav } from "@/components/user-nav";

export async function generateStaticParams() {
  return [{}];
}

export const metadata: Metadata = {
  title: "8 Hour Relay Admin Console",
  description: "Admin Console for 8 Hour Relay",
};

export default async function Home() {
  return <RacenEntriesTable />;
}
