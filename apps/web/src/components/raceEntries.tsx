import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RaceEntry } from "@8hourrelay/models";
import { Icons } from "./icons";

export function RaceEntries({ raceEntries }: { raceEntries: RaceEntry[] }) {
  return (
    <>
      {raceEntries.map((raceEntry, index) => (
        <div
          key={raceEntry.paymentId ?? `${raceEntry.email}${index}`}
          className="flex w-full justify-between items-center mt-3 bg-slate-400 dark:bg-slate-900 rounded-md p-3"
        >
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
            <>
              <span>Name: {raceEntry.displayName}</span>
            </>
            <p className="hidden md:block text-sm font-medium leading-none underline uppercase items-center">
              <Link href={`/team/show/${raceEntry.team}`}>
                {raceEntry.team}
              </Link>
            </p>
            {raceEntry.isPaid ? (
              <div>
                <Icons.check className="w-6 h-6 text-green-500" />
              </div>
            ) : (
              <div></div>
            )}
            <div>
              <Link href={`/register/edit/${raceEntry.id}`}>
                <Icons.edit className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
