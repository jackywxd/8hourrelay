"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TeamData } from "@/store/adminStore";
import { RaceEntry } from "@8hourrelay/models";
import Link from "next/link";
export const columns: ColumnDef<TeamData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name");
      const id = row.original.id;
      console.log(row);
      return (
        <Link href={`/teams/${id}`}>
          <div>{name}</div>
        </Link>
      );
    },
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
      return (
        races
          // .filter((r) => r.isPaid === true)
          .map((r) => {
            return (
              <div>
                {r.email} {r.firstName} {r.lastName}{" "}
                {r.isPaid ? "Paid" : "Not Paid"}
                {r.isActive ? "Active" : "Not Active"}
              </div>
            );
          })
      );
    },
  },
];
