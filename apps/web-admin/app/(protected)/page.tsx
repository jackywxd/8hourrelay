import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { columns } from "@/teams/columns";
import { DataTable } from "@/teams/data-table";
import { getTeams } from "@/actions/teams";
import { useAuth } from "@/auth/context";
import TeamTable from "@/teams/teamTable";

export async function generateStaticParams() {
  return [{}];
}

export default async function Home() {
  return (
    <div>
      <Card>
        <CardHeader>
          <h2>You are logged in</h2>
        </CardHeader>
        <CardContent>
          <TeamTable />
        </CardContent>
      </Card>
    </div>
  );
}
