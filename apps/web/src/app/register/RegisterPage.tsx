"use client";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import { registerStore } from "@8hourrelay/store";
import DisplayRegistration from "./DisplayRegistration";
import RegisterForm from "./RegisterForm";
import ShowRaceEntry from "./ShowRaceEntry";
import ConfirmForm from "./ConfirmPayment";
import LoginFirst from "@/components/LoginFirst";

function RegisterPage({ team }: { team?: string }) {
  const { store } = useAuth();

  useEffect(() => {
    if (team) {
      registerStore.setState("EDIT");
    } else {
      registerStore.setState("INIT");
    }
    registerStore.setTeamValidated(false);
  }, [team]);

  // if no logined user yet, redirect user to login
  if (!store.authStore.isAuthenticated) {
    return <LoginFirst />;
  }

  registerStore.attachedUserStore(store.userStore);
  console.log(`state is ${registerStore.state}`);

  if (registerStore.state === "SHOW") {
    return (
      <>
        <ShowRaceEntry raceEntry={registerStore.raceEntry!} />
        <button
          className="btn btn-md btn-primary mt-10"
          onClick={() => registerStore.setState("INIT")}
        >
          Return
        </button>
      </>
    );
  }

  if (registerStore.state === "EDIT" || registerStore.state === "RE_EDIT") {
    return <RegisterForm team={team} />;
  }
  if (registerStore.state === "FORM_SUBMITTED") {
    return <ConfirmForm />;
  }

  return <DisplayRegistration />;
}

export default observer(RegisterPage);
