import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { IUser } from "./columns";

export default function UserTable({ data }: { data: IUser[] }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-row gap-5 justify-between">
        <div className="flex">
          <h2>All Registered User</h2>
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
