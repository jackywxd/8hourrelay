import { Team } from "@8hourrelay/models";
import TeamItem from "./TeamItem";

function DisplayTeams({ teams }: { teams: Team[] | null }) {
  if (!teams) {
    return null;
  }

  return (
    <div className="teams">
      <div className="grid">
        {teams.map((teamData) => {
          const team = new Team(teamData);
          return <TeamItem team={team} key={team.name} />;
        })}
      </div>
    </div>
  );
}

export default DisplayTeams;
