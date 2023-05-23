"use client";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { registerStore } from "@8hourrelay/store";
import DisplayRegistration from "./DisplayRegistration";
import RegisterForm from "./RegisterForm";
import ShowRaceEntry from "./ShowRaceEntry";
import ConfirmForm from "./ConfirmPayment";
import LoginFirst from "@/components/LoginFirst";

export type REGISTER_STATE = "INIT" | "EDIT" | "FORM_SUBMITTED" | "DELETE";

function RegisterPage() {
  const searchParams = useSearchParams();

  const action = searchParams.get("action"); // payment canceled

  const { store } = useAuth();

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

  if (registerStore.state === "EDIT") {
    return <RegisterForm />;
  }
  if (registerStore.state === "FORM_SUBMITTED") {
    return <ConfirmForm />;
  }

  return <DisplayRegistration />;
}

export default observer(RegisterPage);
