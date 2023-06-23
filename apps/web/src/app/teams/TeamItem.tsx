import Link from "next/link";
import { Team } from "@8hourrelay/models";

function TeamItem({ team }: { team: Team | null }) {
  if (!team) {
    return null;
  }
  const { name, race, isOpen, slogan } = team;
  return (
    <div className={`grid-item`}>
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
        <div className="team-description">{slogan ? slogan : ""}</div>
      </div>
      {isOpen ? (
        <Link href={`/register/join/${name}`}>
          <button className="btn btn-round btn-small btn-light">Join</button>
        </Link>
      ) : (
        <div className="text-center text-red-400">Closed</div>
      )}
    </div>
  );
}

export default TeamItem;
