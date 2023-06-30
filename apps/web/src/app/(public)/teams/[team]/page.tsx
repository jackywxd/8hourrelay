import { redirect } from "next/navigation";
import { Metadata } from "next";

import { getTeam, getTeams } from "@/firebase/serverApi";
import ShowTeam from "./ShowTeam";
import { Team } from "@8hourrelay/models";

interface PageProps {
  params: {
    team: string;
  };
}

export async function generateStaticParams(): Promise<any> {
  const teams = await getTeams();

  return teams?.map((team) => ({
    team: team.name,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const teamName = params.team; // team name

  if (!teamName) {
    return {};
  }

  const t = await getTeam(teamName);
  if (!t) {
    return {};
  }

  const team = new Team(t.team);
  const url = process.env.NEXT_PUBLIC_HOST_NAME;

  const ogUrl = new URL(`${url}api/og`);
  ogUrl.searchParams.set("heading", team.displayName);
  ogUrl.searchParams.set("slogan", team.slogan);
  ogUrl.searchParams.set("type", "website");
  ogUrl.searchParams.set("mode", "dark");

  const title = `8 Hour Relay/Team ${team.displayName}`;
  const description = `Join team ${team.displayName} for the 8 hour relay`;
  return {
    title: `8 Hour Relay/Team ${team.displayName}`,
    description: `Join team ${team.displayName} for the 8 hour relay`,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${url}teams/${team.name}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function TeamPage({ params }: PageProps) {
  const teamName = params.team;
  if (!teamName) {
    redirect("/teams");
  }
  const t = await getTeam(teamName);

  if (!t) {
    redirect("/teams");
  }
  const team = new Team(t.team);

  return (
    <div className="container mx-auto p-3 mt-20">
      <ShowTeam team={team} />
    </div>
  );
}

export const revalidate = 300;
