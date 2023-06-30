import { Suspense } from "react";
import Link from "next/link";
import { Team } from "@8hourrelay/models";
import { getTeams } from "@/firebase/serverApi";
import DisplayTeams from "./DisplayTeams";
import Loader from "@/components/Loader";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/header";

export default async function AllTeamsPage() {
  const data = await getTeams();

  if (!data) {
    return (
      <div className="container mx-auto pt-10">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="users" />
          <EmptyPlaceholder.Title>No Team avaiable yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
          <Button>
            <Link className="link open-button" href="/team/create">
              Create Team Now
            </Link>
          </Button>
        </EmptyPlaceholder>
      </div>
    );
  }

  const teams = data as Team[];
  console.log(`all teams data`, { teams });

  return (
    <div className="container mx-auto md:w-[1024px] p-3">
      <DashboardHeader
        heading="All Teams"
        text='Below are all teams available. To join a team, click the "Join" button. Any newly created teams will appear here once they are approved.'
      >
        {/* <TeamCreateButton /> */}
      </DashboardHeader>
      <Suspense fallback={Loader}>
        <DisplayTeams teams={teams} />
      </Suspense>
    </div>
  );
}
