"use client";
import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { observer } from "mobx-react-lite";
import { useAuth } from "@/context/AuthContext";

interface RaceEntryCreateButtonProps extends ButtonProps {}

export const TeamCreateButton = observer(
  ({ className, variant, ...props }: RaceEntryCreateButtonProps) => {
    const { store } = useAuth();
    return (
      <Link href="/team/create">
        <button
          className={cn(buttonVariants({ variant }), className)}
          {...props}
        >
          {store.userStore.myTeam ? "Edit Team" : "Create New Team"}
        </button>
      </Link>
    );
  }
);
