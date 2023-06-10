"use client";
import { observer } from "mobx-react-lite";
import { RaceEntry } from "@8hourrelay/models";
import { registerStore } from "@8hourrelay/store";
import Link from "next/link";

const TABLE_HEAD = ["Name", "Race", "Bib", "Team", ""];

function DisplayRegistration() {
  return (
    <div className="flex flex-col w-full justify-center items-center gap-8">
      <div>
        <div>Manage your race entry</div>
      </div>
      <div className="flex w-full justify-end">
        <Link className="link link-primary" href="/register/create">
          New Registration
        </Link>
      </div>
      <div className="card card-compact w-full bg-base-100 shadow-xl justify-center gap-8">
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
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th key={`${head}-${index}`}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {raceEntries
            .filter((f: RaceEntry) => f && f.isActive)
            .map(({ displayName, race, bib, team, isPaid }, index) => {
              return (
                <tr key={`${displayName}-${index}`}>
                  <td>
                    <div>
                      <div className="font-bold">{displayName}</div>
                    </div>
                  </td>
                  <td>{race}</td>
                  <td>{bib ? bib : `TBD`}</td>
                  <td>
                    {isPaid ? (
                      <div>
                        <Link href={`/team/${team}`}>
                          <div className="link link-accent font-bold">
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
            })}
        </tbody>
      </table>
    </div>
  );
});

export default observer(DisplayRegistration);
