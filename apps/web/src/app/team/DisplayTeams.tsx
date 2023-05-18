"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Team } from "@8hourrelay/models";

const TABLE_HEAD = ["Name", "Race", ""];

function DisplayTeams({ teams }: { teams: Team[] }) {
  console.log(`display team`, { teams });
  const { store } = useAuth();
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
          {teams.map(({ name, race, captainEmail }, index) => {
            return (
              <tr key={`${name}-${index}`}>
                <td>
                  <div>
                    <Link href={`/team/${name}`}>
                      <div className="font-bold">{name}</div>
                    </Link>
                  </div>
                </td>
                <td>{race}</td>
                <td className="flex gap-2">
                  <button className="btn !btn-primary btn-xs">Join</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayTeams;
