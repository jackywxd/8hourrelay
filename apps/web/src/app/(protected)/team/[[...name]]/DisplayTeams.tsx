import { Team } from "@8hourrelay/models";
import TeamItem from "./TeamItem";
import { Card } from "@/components/ui/card";

function DisplayTeams({ teams }: { teams: Team[] | null }) {
  if (!teams) {
    return null;
  }

  return (
    <Card>
      <div className="flex gap-3 flex-col m-3">
        {teams.map((teamData) => {
          const team = new Team(teamData);
          return <TeamItem team={team} key={team.name} />;
        })}
      </div>
    </Card>
  );
}

export default DisplayTeams;

export const revalidate = 300;
