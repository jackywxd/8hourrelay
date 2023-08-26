"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { columns } from "@/teams/columns";
import { DataTable } from "@/teams/data-table";
import { useAuth } from "@/auth/context";
import { toJS } from "mobx";

export async function generateStaticParams() {
  return [{}];
}

export default function TeamTable() {
  const { store } = useAuth();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={toJS(store?.teams)} />
    </div>
  );
}
