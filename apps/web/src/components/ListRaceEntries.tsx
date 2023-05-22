import { RaceEntry } from "@8hourrelay/models";

const TABLE_HEAD = ["", "Name", "Race", "Bib", "Team", ""];

function ListRaceEntries({
  raceEntries,
  selected,
  setSelected,
}: {
  raceEntries: RaceEntry[];
  selected: number[];
  setSelected: (index: number[]) => void;
}) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th key={`head${index}`}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {raceEntries
            .filter((f) => f.isActive)
            .map(({ id, displayName, race, bib, team, isPaid }, index) => {
              if (!displayName) return null;
              return (
                <tr
                  className={
                    selected.includes(index) ? `opacity-50` : undefined
                  }
                  key={`${id}`}
                  onClick={() => {
                    selected.includes(index)
                      ? setSelected(selected.filter((f) => f === index))
                      : setSelected([...selected, index]);
                  }}
                >
                  <td>
                    <input
                      type="checkbox"
                      defaultChecked={selected.includes(index)}
                      className="checkbox"
                    />
                  </td>
                  <td>
                    <div>
                      <div className="font-bold">{displayName}</div>
                    </div>
                  </td>
                  <td>{race}</td>
                  <td>{bib ? bib : `TBD`}</td>
                  <td></td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default ListRaceEntries;
