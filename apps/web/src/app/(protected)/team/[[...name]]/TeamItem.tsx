import Link from "next/link";
import { Team } from "@8hourrelay/models";
import Image from "next/image";
function TeamItem({ team }: { team: Team | null }) {
  if (!team) {
    return null;
  }
  const { displayName: name, race, isOpen, slogan } = team;
  return (
    <Link href={`/team/show/${name}`}>
      <div className="flex bg-slate-300 dark:bg-slate-900 border justify-between items-center rounded-md hover:cursor-pointer group">
        <div className="m-3 dark:text-red-200">
          <Image
            src={
              race === "Adult Race"
                ? "/img/icon_adult.svg"
                : "/img/icon_youth.svg"
            }
            alt="Team Icon"
            width={50}
            height={50}
          />
        </div>
        <div className="flex-col gap-3 w-1/3">
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">
            {slogan ? slogan : ""}
          </p>
        </div>
        <div className="m-3">
          {isOpen ? (
            <Link href={`/register/join/${name}`}>
              <div className="w-20 p-1 text-center border rounded-full border-blue-600 group-hover:bg-blue-500">
                Join
              </div>
            </Link>
          ) : (
            <div className="w-20 p-1 text-center border rounded-full bg-red-500">
              Closed
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default TeamItem;
