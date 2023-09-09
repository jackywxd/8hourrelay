import Link from "next/link";
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { Tokens } from "next-firebase-auth-edge/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { columns } from "@/teams/columns";
import { DataTable } from "@/teams/data-table";
import { getTeams } from "@/actions/teams";
import { useAuth } from "@/auth/context";
import TeamTable from "@/teams/teamTable";
import RacenEntriesTable from "@/raceEntries/raceEntriesTable";
import { mapTokensToUser } from "@/auth/server-auth-provider";

export async function generateStaticParams() {
  return [{}];
}

export default async function Home() {
  const tokens = await getTokens(cookies(), authConfig);
  const user = tokens ? mapTokensToUser(tokens) : null;

  return (
    <Card>
      <CardHeader>
        <h2>Welcome {user?.email}</h2>
      </CardHeader>
      <CardContent>
        <RacenEntriesTable />
        {/* <TeamTable /> */}
      </CardContent>
    </Card>
  );
}
