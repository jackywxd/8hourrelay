"use client";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import { registerStore } from "@8hourrelay/store";
import RegisterForm from "./RegisterForm";
import ConfirmForm from "./ConfirmPayment";
import { Team } from "@8hourrelay/models";
import EditRegisterForm from "./EditRegisterForm";

function RegisterPage({
  team,
  action,
  raceId,
}: {
  team?: Team;
  action?: string;
  raceId?: string;
}) {
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
  } // edit current paid registration
  else if (raceId) {
    const race = registerStore.initWithRaceid(raceId);
    if (race && race.isPaid) {
      return <EditRegisterForm race={race} />;
    } else {
      return <RegisterForm team={undefined} raceId={raceId} />;
    }
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
