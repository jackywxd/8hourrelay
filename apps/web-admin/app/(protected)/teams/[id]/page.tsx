import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";

import { mapTokensToUser } from "@/auth/server-auth-provider";
import { authConfig } from "@/config/server-config";
import { getAllData } from "@/actions/data-api";
import { Team } from "@8hourrelay/models";

export async function generateStaticParams() {
  const data = await getAllData(null);

  return data.teams?.map((team) => ({
    id: team.id,
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <div>TeamID: {id}</div>;
}
