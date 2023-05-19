"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const JoinTeamButton = ({ name, id, raceEntryId }) => {
  const { store } = useAuth();
  const [state, setState] = useState("INIT");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  console.log(`joinbutton`, { raceEntryId });
  const onJoinTeam = async () => {
    if (!password) {
      setError("Please input password");
    }
    if (raceEntryId && password) {
      await store.userStore.joinTeam(raceEntryId, id, password);
      return;
    }
  };

  return (
    <div>
      {state === "INIT" ? (
        <button
          className="btn !btn-primary btn-xs"
          onClick={() => {
            if (!raceEntryId) {
              router.push(`/team/${name}/add/${id}`);
            } else {
              router.push(`/team/${id}/join/${raceEntryId}`);
              // setState("INPUT");
            }
          }}
        >
          select
        </button>
      ) : state === "INPUT" ? (
        <div className="flex justify-center items-center gap-3">
          <input
            type="password"
            placeholder="Enter team password to join"
            className="input w-full max-w-xs"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={password ? false : true}
            className={`btn btn-xs ${
              password ? "!btn-primary" : "!btn-disabled"
            }`}
            onClick={() => {
              if (password) setState("CONFIRM");
            }}
          >
            JOIN
          </button>
          <button
            className={`btn btn-xs btn-secondary`}
            onClick={() => {
              setState("INIT");
            }}
          >
            cancel
          </button>
        </div>
      ) : (
        <button
          className="btn !btn-primary btn-xs"
          onClick={onJoinTeam}
          disabled={password ? false : true}
        >
          CONFIRM
        </button>
      )}
    </div>
  );
};
