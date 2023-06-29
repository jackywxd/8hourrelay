import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RaceEntry } from "@8hourrelay/models";

export function RaceEntries({ raceEntries }: { raceEntries: RaceEntry[] }) {
  return (
    <>
      {raceEntries.map((raceEntry) => (
        <div className="flex w-full justify-between items-center mt-3 bg-slate-900 rounded-md p-3">
          <div className="w-1/4 items-center justify-between gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  raceEntry.race === "Adult Race"
                    ? "/img/icon_adult.svg"
                    : "/img/icon_youth.svg"
                }
                alt="Avatar"
              />
              <AvatarFallback>{raceEntry.raceDisplayName}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex w-full justify-between items-center">
            <div>
              <div>Name: {raceEntry.displayName}</div>
              <div className="text-sm text-muted-foreground">
                Email: {raceEntry.email}
              </div>
            </div>
            <p className="text-sm font-medium leading-none underline uppercase items-center">
              <Link href={`/team/show/${raceEntry.team}`}>
                Team: {raceEntry.team}
              </Link>
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
