"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/column-header";

export interface IUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  lastSignInTime: string;
  creationTime: string;
}

const columnHelper = createColumnHelper<IUser>();

export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "displayName",
    header: "Display Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "uid",
    header: "Uid",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "lastSignInTime",
    header: "lastSignInTime",
  },
  {
    accessorKey: "creationTime",
    header: "creationTime",
  },
];
