"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Field, ErrorMessage } from "formik";
import { Input } from "@material-tailwind/react";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CreateTeamForm from "./CreateTeamForm";
import { teamStore } from "@8hourrelay/store/src/UIStore";

function ConfirmForm() {
  const [confirm, setConfirm] = useState(false);
  const team = teamStore.form!;

  const onSubmit = async () => {
    await teamStore.createTeam();
  };
  const onEdit = () => {
    teamStore.setState("RE_EDIT");
  };

  return (
    <div className="flex w-2/3 justify-center items-center mt-10">
      <div className="flex flex-col w-full -mx-3 mb-6">
        <div>
          Below is the new team information, please reveiw carefully and press
          confirm to create the team.
        </div>
        <div className="flex w-full justify-between">
          <div>Race:</div>
          <div>{team.race}</div>
        </div>
        <div className="flex w-full justify-between">
          <div>Name:</div>
          <div>{team.name}</div>
        </div>
        <div className="flex w-full justify-between">
          <div>Captain Name:</div>
          <div>{team.captainName}</div>
        </div>
        <div className="flex w-full justify-between">
          <div>Password:</div>
          <div>{team.password}</div>
        </div>
        {team.slogan && <div>Slogon: {team.slogan}</div>}
        <div className="form-control mt-3">
          <label className="label cursor-pointer gap-3">
            <span className="label-text">CONFIRM</span>
            <input
              type="checkbox"
              checked={confirm}
              className="checkbox checkbox-md checkbox-primary"
              onChange={() => {
                setConfirm(!confirm);
              }}
            />
          </label>
        </div>
        <div className="flex w-full justify-between mt-10">
          <button
            type="submit"
            className="btn btn-primary w-1/3"
            onClick={onSubmit}
            disabled={!confirm || teamStore.isLoading}
          >
            create
          </button>
          <button
            type="submit"
            className="btn w-1/3"
            onClick={onEdit}
            disabled={teamStore.isLoading}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default observer(ConfirmForm);

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
