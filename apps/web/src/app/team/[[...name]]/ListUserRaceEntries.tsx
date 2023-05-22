"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import Loader from "@/components/Loader";
import ListRaceEntries from "@/components/ListRaceEntries";
import { Team } from "@8hourrelay/models";

// race: adult or Kids
// id: team ID
const ListUserRaceEntries = ({
  displayName,
  race,
  id,
}: {
  displayName: string;
  race: string;
  id: string;
}) => {
  const { store } = useAuth();
  const [state, setState] = useState("INIT");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const raceEntries = store.userStore.raceEntries?.filter(
    (f) => f && f.race === race && !f.team
  );

  const onJoinTeam = async () => {
    if (id && password && selected.length !== 0) {
      let entries: string[] = [];
      selected.forEach((s) => entries.push(raceEntries[s].id));
      await store.userStore.joinTeam(entries, id, password);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-fit justify-center items-center">
      <div className="flex w-full justify-center">
        <h1>
          Select member to join {race} Team: {displayName}
        </h1>
      </div>
      <div className={selected === null ? "invisible" : "visible"}>
        <div className="flex items-center m-8 gap-10">
          {store.userStore.isLoading ? (
            <Loader />
          ) : store.userStore.error ? (
            <>
              <div className="text-error">Error: {store.userStore.error}</div>
              <button
                className="btn btn-error"
                onClick={() => {
                  setState("INIT");
                  setPassword("");
                  store.userStore.setError("");
                }}
              >
                Re-Enter
              </button>
            </>
          ) : (
            <>
              {state === "INIT" ? (
                <div className="flex justify-center items-center gap-10">
                  {/* <input
                    type="password"
                    placeholder="Enter team password"
                    className="input w-full max-w-xs"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    disabled={password ? false : true}
                    className={`btn btn-md ${
                      password ? "!btn-primary" : "!btn-secondary"
                    }`}
                    onClick={() => {
                      if (password) setState("CONFIRM");
                    }}
                  >
                    JOIN
                  </button> */}
                </div>
              ) : (
                <div className="flex items-center gap-10">
                  <div className="flex w-full justify-between gap-3">
                    <button
                      className="btn !btn-primary btn-md"
                      onClick={onJoinTeam}
                      disabled={password ? false : true}
                    >
                      CONFIRM
                    </button>
                    <button
                      className="btn btn-md"
                      onClick={() => setState("INIT")}
                      disabled={password ? false : true}
                    >
                      Re-enter password
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="divider" />
      <div className="flex w-full justify-between"></div>
      <div>
        <ListRaceEntries
          raceEntries={raceEntries}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
};

export default observer(ListUserRaceEntries);
