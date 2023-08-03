import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getTeamLogoUrl } from "./getTeamLogoUrl";
import { Team } from "@8hourrelay/models";
import ShareButtons from "./ShareButtons";

export default async function TeamPage({ team }: { team: Team }) {
  const ogUrl = getTeamLogoUrl(team);
  const shareUrl = `${process.env.NEXT_PUBLIC_HOST_NAME}${team.teamUrl}`;
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex w-full flex-row-reverse gap-3 m-3 p-3">
          {team.isOpen && (
            <Link href={`/register/join/${team.name}`}>
              <Button>Join {team.displayName}</Button>
            </Link>
          )}
          <Link href={`/team/show/${team.name}`}>
            <Button>Details</Button>
          </Link>
        </div>
        <ShareButtons
          url={shareUrl}
          title={`Join my relay team ${team.displayName}`}
        />
        <div className="relative">
          <img
            className="rounded-md"
            src={ogUrl}
            alt={`Team ${team.displayName} image`}
            width={1200}
            height={630}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </div>
    </>
  );
}
