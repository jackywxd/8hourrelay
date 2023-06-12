"use client";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { RaceEntry, Team } from "@8hourrelay/models";
import LoginFirst from "@/components/LoginFirst";
import { useState } from "react";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FieldItem } from "../register/RegisterForm";
const TABLE_HEAD = ["Name", "Email", ""];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
// data passed from server side is plain object
function MyTeam() {
  const { store } = useAuth();
  const team = store.userStore.myTeam;
  const [enabled, setEnabled] = useState(store.userStore.myTeam?.isOpen);
  const [password, setPassword] = useState(store.userStore.myTeam?.password);
  const [slogan, setSlogan] = useState(store.userStore.myTeam?.slogan);

  const initialValues = {
    isOpen: store.userStore.myTeam?.isOpen,
    password: store.userStore.myTeam?.password ?? "",
    slogan: store.userStore.myTeam?.slogan ?? "",
  };
  const Schema = Yup.object().shape({
    password: Yup.string().nonNullable().required("Required"),
    slogon: Yup.string(),
  });

  if (!store.userStore.myTeam) return null;

  const onSubmit = () => {
    if (!password) {
      toast.error(`Team password cannot be blank`);
      return;
    }
    store.userStore.onUpdateTeam({ isOpen: enabled, password, slogan });
  };
  return (
    <div className="flex flex-col w-full items-center">
      <div>
        <h1>My Team: {store.userStore.myTeam.displayName}</h1>
        <h2>Race: {store.userStore.myTeam.raceDisplayName}</h2>
      </div>
      <div className="flex self-end">
        <Link
          className="link link-primary"
          href={`/team/${store.userStore.myTeam.name}`}
        >
          Team Details
        </Link>
      </div>
      <div className="divider" />
      <div className="flex w-full justify-between items-center">
        <h2>Open For Registration:</h2>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={classNames(
            enabled ? "bg-indigo-600" : "bg-gray-200",
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              enabled ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            )}
          />
        </Switch>
      </div>
      <div className="flex w-full justify-between items-center">
        <h2 className="leading-6 ">Team Password:</h2>
        <div className="mt-2">
          <input
            value={password}
            type="text"
            name="first-name"
            id="first-name"
            autoComplete="given-name"
            className="block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            onChange={(value) => setPassword(value.target.value)}
          />
        </div>
      </div>
      <div className="flex w-full justify-between items-center">
        <h2 className="leading-6 ">Team Slogan:</h2>
        <div className="mt-2">
          <input
            value={slogan}
            type="text"
            name="slogan"
            id="slogan"
            className="block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            onChange={(value) => setSlogan(value.target.value)}
          />
        </div>
      </div>
      <div className="mt-8 w-full">
        <button
          type="submit"
          className="rounded-full w-full bg-indigo-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={onSubmit}
          disabled={store.userStore.isLoading ? true : false}
        >
          Save
        </button>
      </div>
    </div>
  );
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form className="flex w-full flex-col gap-6 justify-center items-center">
          <FieldItem label="Team Password*" fieldName="password" />
          <FieldItem label="Slogan" fieldName="slogan" />

          <div className="flex flex-row w-full justify-between">
            <button type="submit" className="btn btn-primary">
              save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default observer(MyTeam);
