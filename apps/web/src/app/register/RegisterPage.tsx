"use client";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { registerStore } from "@8hourrelay/store";
import DisplayRegistration from "./DisplayRegistration";
import RegisterForm from "./RegisterForm";
import ShowRaceEntry from "./ShowRaceEntry";
import ConfirmForm from "./ConfirmPayment";

export type REGISTER_STATE = "INIT" | "EDIT" | "FORM_SUBMITTED" | "DELETE";

function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const action = searchParams.get("action"); // payment canceled

  const { store } = useAuth();

  // if no logined user yet, redirect user to login
  if (!store.authStore.isAuthenticated) {
    return (
      <div className="flex flex-w flex-wrap w-full justify-center gap-12">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Adult Race</h2>
            <p>Race for Adult</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() => {
                  router.push("/login?continue=register&race=adult");
                }}
              >
                Register For Adult
              </button>
            </div>
          </div>
        </div>
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Kids Run</h2>
            <p>Race for kids under 18</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() => {
                  router.push("/login?continue=register&race=kids");
                }}
              >
                Register For Kids Run
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
  if (registerStore.state === "ERROR") {
    return <div>Error: ${registerStore.error}</div>;
  }
  if (registerStore.state === "SUCCESS") {
    return <div>Success!!</div>;
  }

  return <DisplayRegistration />;
}

export default observer(RegisterPage);
