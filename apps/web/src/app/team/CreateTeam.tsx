"use client";
import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button } from "@material-tailwind/react";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import SelectComponent from "@/components/SelecComponent";
import CreateTeamForm from "./CreateTeamForm";

function CreateTeam() {
  const { store } = useAuth();
  const router = useRouter();
  const [state, setState] = useState("INIT");
  const [team, setTeam] = useState({ name: "", slogon: "", race: "" });

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
  if (state === "INIT" && store.userStore.user?.teamYear) {
    const y = store.userStore.user.teamYear.split("-");
    const year = new Date().getFullYear().toString();
    if (y[0] === year) return null;
  }

  const onSubmit = async () => {
    await store.userStore.createTeam(team);
  };

  return (
    <div className="flex w-full items-center mt-10">
      {state === "INIT" ? (
        <button
          className="btn btn-primary"
          onClick={() => {
            setState("CREATE");
          }}
        >
          Create Team
        </button>
      ) : state === "CREATE" ? (
        <CreateTeamForm
          onBack={() => {
            setState("INIT");
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
          {team.slogon && <div>Slogon: {team.slogon}</div>}
          <button
            onClick={async () => {
              await onSubmit();
              setState("COMPLETED");
            }}
          >
            confirm
          </button>
        </div>
      ) : state === "COMPLETED" ? (
        <div className="flex flex-col w-full -mx-3 mb-6">
          Your team {team.name} was created and pending for approval. We will
          notify you once it is approved.
          <button
            className="btn btn-primary"
            onClick={() => {
              setState("INIT");
            }}
          >
            OK
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default CreateTeam;

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
