"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { columns } from "@/teams/columns";
import { DataTable } from "@/teams/data-table";
import { useAuth } from "@/auth/context";
import { toJS } from "mobx";
import { CSVLink, CSVDownload } from "react-csv";

export async function generateStaticParams() {
  return [{}];
}

export default function TeamTable() {
  const { store } = useAuth();
  const data = toJS(store?.teams);
  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-row gap-5 justify-between">
        <div className="flex">
          <h2>Teams Data</h2>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
      <div>
        <CSVLink
          data={data}
          filename={"my-file.csv"}
          className="btn btn-primary bg-black hover:bg-gray-800"
          target="_blank"
        >
          Download me
        </CSVLink>
      </div>
    </div>
  );
}
