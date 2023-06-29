import { Suspense } from "react";
import Link from "next/link";
import { Team } from "@8hourrelay/models";
import { getTeams } from "@/firebase/serverApi";
import DisplayTeams from "./DisplayTeams";
import Loader from "@/components/Loader";

import "./teams.css";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";

export default async function TeamsPage() {
  const data = await getTeams();

  if (!data) {
    return (
      <div className="container mx-auto pt-20">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="users" />
          <EmptyPlaceholder.Title>No Team avaiable yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            It is so quiet...
          </EmptyPlaceholder.Description>
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
    <div className="container mx-auto p-3">
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title">Find your team to join</div>
          <div className="page-description">
            Must sign in to join a team. All team members must have a valid
            entry and complete the registration process before the entry
            deadline.
          </div>
        </div>

        {/* <button className="btn btn-primary btn-large blue">
					<Link className="link open-button" href="/teams/create">
						Create team
					</Link>
				</button> */}
      </div>
      <Suspense fallback={Loader}>
        <DisplayTeams teams={teams} />
      </Suspense>
    </div>
  );
}

// every 5 minutes will refersh the pages
export const revalidate = 300;
