"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Field, ErrorMessage } from "formik";
import { Input } from "@material-tailwind/react";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CreateTeamForm from "./CreateTeamForm";

function CreateTeam() {
  const { store } = useAuth();
  const router = useRouter();
  const [state, setState] = useState("INIT");
  const [team, setTeam] = useState({
    captainName: store.userStore.user?.displayName ?? "",
    name: "",
    slogon: "",
    race: "",
    password: "",
  });

  useEffect(() => {
    if (store.userStore.error) {
      setState("ERROR");
    }
  }, [store.userStore.error]);

  const onSubmit = async () => {
    // await store.userStore.createTeam(team);
  };

  if (!store.authStore.isAuthenticated) {
    return (
      <div className="w-full max-w-lg">
        <div className="flex flex-wrap min-w-full -mx-3 mb-6 justify-center">
          Please login before create a team
        </div>
        <button
          className="btn-primary btn-md rounded-lg justify-center"
          onClick={() => {
            router.push("/login?continue=team");
          }}
        >
          Login
        </button>
      </div>
    );
  }

  // if the current user is already a created a team, return null
  // one user can only create one team
  if (state === "INIT" && !store.userStore.pendingTeamRequest) {
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

  return (
    <div className="flex w-full justify-center items-center mt-10">
      {state === "INIT" ? (
        <CreateTeamForm
          initialValues={team}
          onBack={() => {
            router.push("/team");
          }}
          onSubmit={(values) => {
            setTeam(values);
            setState("CONFIRM");
          }}
        />
      ) : state === "CONFIRM" ? (
        <div className="flex flex-col w-full -mx-3 mb-6">
          <div>
            Below is the new team information, please reveiw carefully and press
            confirm to create the team.
          </div>
          <div>Race: {team.race}</div>
          <div>Name: {team.name}</div>
          <div>Captain Name: {team.captainName}</div>
          <div>Password: {team.password}</div>
          {team.slogon && <div>Slogon: {team.slogon}</div>}
          <button
            className="btn btn-primary mt-10"
            onClick={async () => {
              await onSubmit();
              setState("COMPLETED");
            }}
          >
            confirm
          </button>
        </div>
      ) : state === "ERROR" ? (
        <div className="flex flex-col w-full -mx-3 mb-6">
          Failed to create team {team.name}! Please double check your team name
          and make sure team name is not taken
          <button
            className="btn btn-error mt-10"
            onClick={() => {
              setState("INIT");
            }}
          >
            OK
          </button>
        </div>
      ) : state === "COMPLETED" ? (
        <div className="flex flex-col w-full -mx-3 mb-6">
          <div className="m-10">
            Your team {team.name} was created and pending for approval. We will
            notify you via email once it is approved.
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              router.push("/teams");
            }}
          >
            Return
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default observer(CreateTeam);

export const FieldItem = ({ label, fieldName, ...props }) => {
  return (
    <>
      <Field
        as={CustomInputComponent}
        id={fieldName}
        name={fieldName}
        label={label}
        {...props}
      />
      <ErrorMessage component="a" name={fieldName} />
    </>
  );
};

const CustomInputComponent = (props) => (
  <div className="flex flex-col w-72 items-end gap-6">
    <Input
      type="text"
      className="input input-primary w-full max-w-xs"
      {...props}
    />
  </div>
);
