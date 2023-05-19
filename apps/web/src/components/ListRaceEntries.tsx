import { RaceEntry } from "@8hourrelay/models";

const TABLE_HEAD = ["Name", "Race", "Bib", "Team", ""];

function ListRaceEntries({ raceEntries }: { raceEntries: RaceEntry[] }) {
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
          {raceEntries
            .filter((f) => f.isActive)
            .map(({ id, displayName, race, bib, team, isPaid }, index) => {
              if (!displayName) return null;
              return (
                <tr key={`${displayName}-${index}`}>
                  <td>
                    <div>
                      <div className="font-bold">{displayName}</div>
                    </div>
                  </td>
                  <td>{race}</td>
                  <td>{bib ? bib : `TBD`}</td>
                  <td>{team}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default ListRaceEntries;
