"use client";
import { columns } from "@/raceEntries/columns";
import { DataTable } from "@/components/data-table";
import { useAuth } from "@/auth/context";
import { toJS } from "mobx";

export async function generateStaticParams() {
  return [{}];
}

export default function TeamTable() {
  const { store } = useAuth();
  const data = toJS(store?.raceEntries);

  if (!data) {
    return null;
  }
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-row gap-5 justify-between">
        <div className="flex">
          <h2>Race Entries Data</h2>
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}