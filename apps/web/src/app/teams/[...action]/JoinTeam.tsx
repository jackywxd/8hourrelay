"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const TABLE_HEAD = ["Name", "email", ""];

function TeamMemberList({ team }: { team: string | undefined }) {
  const { store } = useAuth();
  const [state, setState] = useState("INIT");

  return (
    <div className="flex">
      {state === "INIT" ? (
        <div className="flex">
          <div
            className="btn btn-primary btn-sm"
            onClick={() => {
              setState("ADD");
            }}
          >
            Join
          </div>
        </div>
      ) : (
        <div>
          <p>Select race entry below to join team {team}</p>
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
              {store.userStore.raceEntries.map(
                ({ firstName: name, email, team }, index) => {
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
                        {team ? (
                          <button className="btn btn-xs">Join</button>
                        ) : null}
                      </th>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TeamMemberList;
