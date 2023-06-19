import { Suspense } from "react";
import Link from "next/link";
import { Team } from "@8hourrelay/models";
import { getTeams } from "@/firebase/serverApi";
import DisplayTeams from "./DisplayTeams";
import Loader from "@/components/Loader";

import "@/styles/teams.css";
import "@/styles/form.css";
export default async function TeamsPage() {
	const data = await getTeams();

	if (!data) {
		return (
			<div className="page-header">
				<div className="page-title-group">
					<div className="page-title">All temas</div>
					<div className="page-description">
						No team has been created yet
					</div>
					<div className="m-10">
						<button className="btn btn-primary btn-medium blue">
							<Link
								className="link open-button"
								href="/teams/create">
								Create Team Now
							</Link>
						</button>
					</div>
				</div>
			</div>
		);
	}

	const teams = data as Team[];
	console.log(`all teams data`, { teams });

	return (
		<>
			<div className="page-header">
				<div className="page-title-group">
					<div className="page-title">Create New Team</div>
					<div className="page-description">
						All team members must have a valid entry and complete
						the registration process before the entry deadline.
					</div>
				</div>

				<button className="btn btn-primary btn-large blue">
					<Link className="link open-button" href="/teams/create">
						Create team
					</Link>
				</button>
			</div>
			<Suspense fallback={Loader}>
				<DisplayTeams teams={teams} />
			</Suspense>
		</>
	);
}
