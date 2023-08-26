"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TeamData } from "@/store/adminStore";
import { RaceEntry } from "@8hourrelay/models";

export const columns: ColumnDef<TeamData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "captainEmail",
    header: "Captain Email",
  },
  {
    accessorKey: "race",
    header: "Race",
  },
  {
    accessorKey: "raceEntries",
    header: "Team Members",
    cell: ({ row }) => {
      const races = row.getValue("raceEntries") as RaceEntry[];
      console.log(races);
      return races?.map((r) => {
        return (
          <div>
            {r.email} {r.firstName} {r.lastName}
          </div>
        );
      });
    },
  },
];
