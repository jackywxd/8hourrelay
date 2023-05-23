import { RaceEntry } from "@8hourrelay/models";
import { registerStore } from "@8hourrelay/store";
import { Button } from "@material-tailwind/react";
import { observer } from "mobx-react-lite";

const TABLE_HEAD = ["Name", "Race", "Bib", "Team", ""];

function DisplayRegistration() {
  return (
    <div className="flex flex-col w-full justify-center items-center gap-8">
      <div>
        <div>Manage your races</div>
      </div>
      <div className="card card-compact w-full bg-base-100 shadow-xl justify-center gap-8">
        <RegistrationTable />
      </div>
      <div className="flex w-full justify-end">
        <Button
          className="!btn-primary"
          onClick={() => {
            registerStore.setEditIndex(null);
            registerStore.setState("EDIT");
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

const RegistrationTable = () => {
  const raceEntries = registerStore.userStore?.raceEntries;

  if (!raceEntries) {
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
                  <td>{isPaid ? team : ``}</td>
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
};
export default observer(DisplayRegistration);
