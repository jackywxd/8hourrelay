import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RaceEntry } from "@8hourrelay/models";
import { TeamOperations } from "@/components/team-operations";
export function RaceEntries({ raceEntries }: { raceEntries: RaceEntry[] }) {
  return (
    <>
      {raceEntries.map((raceEntry) => (
        <Accordion type="single" collapsible key={raceEntry.paymentId}>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center justify-between p-4">
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
                {raceEntry.team}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center justify-between p-4">
                <div className="grid gap-1">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {raceEntry.displayName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {raceEntry.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{raceEntry.bib}</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
}
