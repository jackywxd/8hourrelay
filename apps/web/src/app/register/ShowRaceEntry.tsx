import { RaceEntry } from "@8hourrelay/models";
import Link from "next/link";

const data = {
  firstName: "First Name",
  lastName: "Last Name",
  preferName: "Prefer Name",
  phone: "Phone",
  gender: "Gender",
  personalBest: "Personal Best",
  email: "Email",
  yearBirth: "Year of Birth",
  size: "Selected Shirt Size",
  team: "Team Name",
  emergencyName: "Emergency Contact Name",
  emergencyPhone: "Emergency Contact Phone",
};

function ShowRaceEntry({ raceEntry }: { raceEntry: RaceEntry }) {
  return (
    <div className="w-full p-2">
      <div>Registered Race: {raceEntry.race}</div>
      <div>Entry Fee: {raceEntry.entryFee}</div>
      <div className="divider">Race Entry Info</div>

      <div className="flex flex-wrap">
        {Object.entries(raceEntry).map((entry) => {
          if (entry[1] && data[entry[0]])
            return (
              <div key={entry[0]} className="flex w-full justify-between">
                <div className="">{data[entry[0]]} :</div>
                {entry[0] === "team" ? (
                  <div>
                    <Link href={`/team/${[entry[1]]}`}>
                      <div className="link link-accent font-bold">
                        {entry[1]}
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div>{entry[1]}</div>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
}

export default ShowRaceEntry;
