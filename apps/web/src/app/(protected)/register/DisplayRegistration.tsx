"use client";
import { observer } from "mobx-react-lite";
import { RaceEntry } from "@8hourrelay/models";
import { registerStore } from "@8hourrelay/store";
import Link from "next/link";

const TABLE_HEAD = ["Name", "Race", "Bib", "Team", ""];

function DisplayRegistration() {
  return (
    <div className="content-center">
      <div>
        <div className="table-name">Manage race entry</div>
      </div>
      <div className="flex w-full justify-end">
        <Link className="link link-primary" href="/register/create">
          New Registration
        </Link>
      </div>
      <div className="container">
        <RegistrationTable />
      </div>
    </div>
  );
}

const RegistrationTable = observer(() => {
  const raceEntries = registerStore.userStore?.raceEntries.slice();

  console.log(`raceEntries`, { raceEntries });

  if (!raceEntries || raceEntries.length === 0) {
    return <div>Add your first Race</div>;
  }
  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr className="">
            {TABLE_HEAD.map((head, index) => (
              <th className="table-header" key={`${head}-${index}`}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {raceEntries
            .filter((f: RaceEntry) => f && f.isActive)
            .map(
              ({ displayName, raceDisplayName, bib, team, isPaid }, index) => {
                return (
                  <tr key={`${displayName}-${index}`} className="text-blue-50">
                    <td>
                      <div>
                        <div className="font-bold">{displayName}</div>
                      </div>
                    </td>
                    <td>{raceDisplayName}</td>
                    <td>{bib ? bib : `TBD`}</td>
                    <td>
                      {isPaid ? (
                        <div>
                          <Link href={`/team/${team}`}>
                            <div className="link font-bold text-indigo-400">
                              {team}
                            </div>
                          </Link>
                        </div>
                      ) : (
                        ``
                      )}
                    </td>
                    <th className="flex gap-2">
                      {!isPaid ? (
                        <>
                          <button
                            className="btn btn-xs"
                            onClick={() => {
                              registerStore.setEditIndex(index);
                              registerStore.setState("EDIT");
                            }} // set edit index
                          >
                            Edit
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-xs"
                          onClick={() => {
                            registerStore.setEditIndex(index);
                            registerStore.setState("SHOW");
                          }} // set edit index
                        >
                          details
                        </button>
                      )}
                    </th>
                  </tr>
                );
              }
            )}
        </tbody>
      </table>
    </div>
  );
});

export default observer(DisplayRegistration);
