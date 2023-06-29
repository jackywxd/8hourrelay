"use client";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { registerStore } from "@8hourrelay/store";
import DisplayRegistration from "./DisplayRegistration";
import RegisterForm from "./RegisterForm";
import ShowRaceEntry from "./ShowRaceEntry";
import ConfirmForm from "./ConfirmPayment";
import LoginFirst from "@/components/LoginFirst";
import Loader from "@/components/Loader";
import { Team } from "@8hourrelay/models";

function RegisterPage({
  team,
  action,
  raceId,
}: {
  team?: Team;
  action?: string;
  raceId?: string;
}) {
  const router = useRouter();
  const { store } = useAuth();
  registerStore.attachedUserStore(store.userStore);

  useEffect(() => {
    if (team) {
      registerStore.setState("EDIT");
    } else {
      registerStore.setState("INIT");
    }

    registerStore.setTeamValidated(false);
  }, [team]);

  console.log(`action ${action} team ${team} state is ${registerStore.state}`);

  if (registerStore.state === "FORM_SUBMITTED") {
    return <ConfirmForm />;
  } else if (
    action === "create" ||
    action === "join" ||
    registerStore.state === "RE_EDIT"
  ) {
    return <RegisterForm team={team ? new Team(team) : undefined} />;
  } else {
    // this is for edit
    return (
      <RegisterForm team={team ? new Team(team) : undefined} raceId={raceId} />
    );
  }
}

export default observer(RegisterPage);
