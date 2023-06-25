import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RaceEntry } from "@8hourrelay/models";
import Link from "next/link";

export function RaceEntries({ raceEntries }: { raceEntries: RaceEntry[] }) {
  return (
    <>
      {raceEntries.map((raceEntry) => (
        <Accordion type="single" collapsible key={raceEntry.paymentId}>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center justify-between gap-4">
                <Avatar className="h-9 w-9">
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
                <div> {raceEntry.displayName}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center justify-between p-4">
                <div className="grid gap-1">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <Link href={`/team/${raceEntry.team}`}>
                        Team: {raceEntry.team}
                      </Link>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email: {raceEntry.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Bib: {raceEntry.bib ? raceEntry.bib : "TBD"}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
}
