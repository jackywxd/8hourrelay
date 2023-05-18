import { RaceEntry } from "@8hourrelay/models";
import { useRouter } from "next/navigation";

const TABLE_HEAD = ["Name", "Race", "Bib", "Team", ""];

function DisplayRegistration({
  raceEntries,
  setIndex,
  onPay,
}: {
  raceEntries: RaceEntry[];
  setIndex: (index: number) => void;
  onPay: (index: number) => void;
}) {
  const router = useRouter();

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
            .map(({ displayName, race, bib, team, isPaid }, index) => {
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
                  <td>
                    {team ? (
                      team
                    ) : isPaid ? (
                      <div className="flex gap-2">
                        TBD
                        <button
                          className="btn btn-xs"
                          onClick={() => {
                            router.push("/team");
                          }}
                        >
                          JOIIN
                        </button>
                      </div>
                    ) : null}
                  </td>
                  <th className="flex gap-2">
                    <button
                      className="btn btn-xs"
                      onClick={() => setIndex(index)} // set edit index
                    >
                      Edit
                    </button>
                    {!isPaid && (
                      <>
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => {
                            onPay(index);
                          }}
                        >
                          Pay
                        </button>
                      </>
                    )}
                  </th>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayRegistration;
