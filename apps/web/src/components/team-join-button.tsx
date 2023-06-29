import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { observer } from "mobx-react-lite";
import { Team } from "@8hourrelay/models";

interface RaceEntryCreateButtonProps extends ButtonProps {
  team: Team;
}

export const TeamJoinButton = observer(
  ({ className, variant, team, ...props }: RaceEntryCreateButtonProps) => {
    return (
      <Link href={team.isOpen ? `/register/join/${team.name}` : `/team`}>
        <button
          className={cn(buttonVariants({ variant }), className)}
          disabled={!team.isOpen}
          {...props}
        >
          {team.isOpen ? "Open" : "Closed"}
        </button>
      </Link>
    );
  }
);
