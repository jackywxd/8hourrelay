"use client";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { teamStore } from "@8hourrelay/store/src/UIStore";
import CreateTeamForm from "./CreateTeamForm";
import ConfirmForm from "./ConfirmForm";

function CreateTeam() {
  const { store } = useAuth();
  teamStore.attachedUserStore(store.userStore);

  const router = useRouter();

  // if the current user is already a created a team, return null
  // one user can only create one team
  if (teamStore.state === "INIT" && store.userStore.pendingTeamRequest) {
    return (
      <div className="flex flex-col w-full max-w-lg">
        <div className="flex flex-wrap min-w-full -mx-3 m-6 justify-center ">
          Only one team can be created!
        </div>
        <button
          className="btn-primary btn-md rounded-lg justify-center"
          onClick={() => {
            router.push("/teams");
          }}
        >
          OK
        </button>
      </div>
    );
  }

  if (teamStore.state === "INIT" || teamStore.state === "RE_EDIT") {
    return (
      <div className="flex w-full justify-center items-center mt-10">
        <CreateTeamForm />
      </div>
    );
  }
  if (teamStore.state === "CONFIRM") {
    return (
      <div className="flex w-full justify-center items-center mt-10">
        <ConfirmForm />
      </div>
    );
  }
  if (teamStore.state === "ERROR") {
    return (
      <div className="flex flex-col w-full justify-center items-center">
        Failed to create team! Please double check your team name and make sure
        team name is not taken
        <button
          className="btn btn-error w-1/3"
          onClick={() => {
            teamStore.reset();
            router.push("/teams");
          }}
        >
          OK
        </button>
      </div>
    );
  }
  if (teamStore.state === "SUCCESS") {
    return (
      <div className="flex flex-col w-full justify-center items-center">
        <div className="m-10">
          New team request was submitted and pending for approval. We will
          notify you via email once it is approved.
        </div>
        <button
          className="btn btn-primary w-1/3"
          onClick={() => {
            teamStore.reset();
            router.push("/teams");
          }}
        >
          Return
        </button>
      </div>
    );
  }
  return null;
}

export default observer(CreateTeam);
