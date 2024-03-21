"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/column-header";
import { RaceEntry } from "@8hourrelay/models";

const columnHelper = createColumnHelper<RaceEntry>();

export const columns: ColumnDef<RaceEntry>[] = [
  columnHelper.group({
    header: "Name",
    footer: (props) => props.column.id,
    columns: [
      // Accessor Column
      columnHelper.accessor("firstName", {
        cell: (info) => info.getValue(),
        header: () => <span>First Name</span>,
        footer: (props) => props.column.id,
      }),
      // Accessor Column
      columnHelper.accessor((row) => row.lastName, {
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "race",
    header: "Race",
  },
  {
    accessorKey: "birthYear",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Birth Year" />
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "phone",
    header: "phone",
  },
  {
    accessorKey: "emergencyName",
    header: "Emergency Contact Name",
  },
  {
    accessorKey: "emergencyPhone",
    header: "Emergency Contact Phone",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "preferName",
    header: "Prefered Name",
  },
  {
    accessorKey: "size",
    header: "Shirt Size",
  },
  {
    accessorKey: "team",
    header: "Team Name",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "wechatId",
    header: "WeChat ID",
  },
];
