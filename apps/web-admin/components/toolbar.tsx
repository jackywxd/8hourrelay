"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-facedted-filter";
import { CSVLink, CSVDownload } from "react-csv";
import { Data } from "react-csv/components/CommonPropTypes";
import { DataTableViewOptions } from "@/components/data-table-view-option";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  teamOptions: any;
  data: TData[];
}

export function DataTableToolbar<TData>({
  table,
  teamOptions,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("team") && (
          <DataTableFacetedFilter
            column={table.getColumn("team")}
            title="Team"
            options={teamOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
      <div>
        <CSVLink
          data={data as Data}
          filename={"my-file.csv"}
          className="btn btn-primary bg-black hover:bg-gray-800"
          target="_blank"
        >
          Export
        </CSVLink>
      </div>
    </div>
  );
}
