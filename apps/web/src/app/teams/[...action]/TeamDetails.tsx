"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { RaceEntry, Team } from "@8hourrelay/models";

const TABLE_HEAD = ["Name", "Email", ""];

function TeamMemberList({
  captainEmail,
  members,
}: {
  captainEmail: string;
  members: RaceEntry[] | undefined;
}) {
  const { store } = useAuth();
  if (!members) {
    return null;
  }
  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map(({ firstName: name, email }, index) => {
            return (
              <tr key={`${name}-${index}`}>
                <td>
                  <div>
                    <Link href={`/team/${name}`}>
                      <div className="font-bold">{name}</div>
                    </Link>
                  </div>
                </td>
                <td>{email}</td>
                <th className="flex gap-2">
                  {store.userStore.user?.email === captainEmail ? (
                    <button className="btn btn-xs">Remove</button>
                  ) : null}
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TeamMemberList;
