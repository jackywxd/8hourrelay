"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import Loader from "@/components/Loader";

const JoinTeamButton = ({ id, raceEntryId }) => {
  const { store } = useAuth();
  const [state, setState] = useState("INIT");
  const [password, setPassword] = useState("");

  const onJoinTeam = async () => {
    if (raceEntryId && password) {
      await store.userStore.joinTeam(raceEntryId, id, password);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10">
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
            <div className="flex flex-col justify-center items-center gap-10">
              <input
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
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-10">
              <div>Press confirm to join</div>
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
  );
};

export default observer(JoinTeamButton);
