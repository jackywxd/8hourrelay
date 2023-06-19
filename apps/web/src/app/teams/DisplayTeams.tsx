import Link from "next/link";
import { Team } from "@8hourrelay/models";

function DisplayTeams({
	teams,
	raceEntryId
}: {
	raceEntryId?: string;
	teams: Team[] | null;
}) {
	console.log(`display team raceEntryId`, { raceEntryId });

	if (!teams) {
		return null;
	}

	return (
		<div className="grid">
			{teams.map((team) => {
				const {
					displayName: name,
					isOpen,
					race,
					slogan
				} = new Team(team);
				return (
					<div key={name} className={`grid-item`}>
						<div className="icon-container">
							<Link href={`/team/${name}`}>
								<img
									src={
										race === "Adult Race"
											? "/img/icon_adult.svg"
											: "/img/icon_youth.svg"
									}
								/>
							</Link>
						</div>
						<div className="team-text-container">
							<div className="team-name">{name}</div>
							<div className="team-description">
								{slogan ? slogan : ""}
							</div>
						</div>
						{isOpen ? (
							<Link href={`/register/join/${name}`}>
								<button className="btn btn-round btn-small btn-light">
									Join
								</button>
							</Link>
						) : (
							<div className="text-center text-red-700">
								Closed
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default DisplayTeams;
