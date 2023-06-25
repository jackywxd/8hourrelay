import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

interface RaceEntryCreateButtonProps extends ButtonProps {}

export function RaceEntryCreateButton({
  className,
  variant,
  ...props
}: RaceEntryCreateButtonProps) {
  return (
    <Link href="/register">
      <button className={cn(buttonVariants({ variant }), className)} {...props}>
        New Race Entry
      </button>
    </Link>
  );
}
