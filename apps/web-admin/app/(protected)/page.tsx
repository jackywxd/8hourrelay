import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RacenEntriesTable from "@/tables/raceEntries/raceEntriesTable";
import { mapTokensToUser } from "@/auth/server-auth-provider";
import { UserNav } from "@/components/user-nav";
import { getRaceEntries, listAllUsers } from "@/actions/data-api";
import UserTable from "@/tables/users/users-table";
import { cache } from "react";

export const metadata: Metadata = {
  title: "8 Hour Relay Admin Dashboard",
  description: "Dashboard for 8 Hour Relay",
};

const getAllUsers = cache(async () => {
  const data = await listAllUsers(1000);
  return data;
});

export default async function Home() {
  const data = await getAllUsers();

  // console.log("data", data);
  return (
    <div>
      <UserTable data={data.users} />
    </div>
  );
}
