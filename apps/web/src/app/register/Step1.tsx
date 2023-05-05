"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useAuth } from "@/context/AuthContext";
import { RaceEntryForm } from "@8hourrelay/store/src/RaceEntryStore";
import { clone, getSnapshot } from "mobx-keystone";
import { RaceEntry, User } from "@8hourrelay/models";

const styles = {
  label: "block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2",
  field:
    "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500",
  button: "btn btn-primary py-2 px-4 w-full",
  errorMsg: "text-red-500 text-sm",
};

function Step1() {
  const { store } = useAuth();
  useEffect(() => {
    if (!store.entryForm) {
      store.setEntryForm(
        new RaceEntryForm({
          raceEntry: new RaceEntry({
            uid: store.userStore.user!.uid,
            isActive: true,
          }),
        })
      );
    }
  }, []);
  const form = store.entryForm;
  console.log(`entryForm`, { form: getSnapshot(form) });

  const initialValues = {
    firstName: form?.firstName ?? "",
    lastName: "",
    phone: "",
    postCode: "",
    size: "Pick one",
    emergencyContact: {
      name: "",
      phone: "",
    },
  };
  const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    phone: Yup.string().required("Required"),
    postCode: Yup.string().required("Required"),
    size: Yup.string().required("Required"),
    emergencyContact: Yup.object().shape({
      name: Yup.string().required("Required"),
      phone: Yup.string().required("Required"),
    }),
  });

  if (!form) {
    return null;
  }
  const onSubmit = async () => {
    await form.submitForm();
    store.setEntryForm(form);
  };
  return (
    <div className="w-full max-w-lg">
      <div>Email: {store.userStore.user?.email}</div>
      <div className="divider">Basic Info</div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {(props) => (
            <Form>
              <FieldItem
                label="First Name"
                fieldName="firstName"
                onChange={(e) => {
                  form.setFirstName(e.target.value);
                  props.handleChange(e);
                }}
              />
              <FieldItem
                label="Last Name"
                fieldName="lastName"
                onChange={(e) => {
                  form.setLastName(e.target.value);
                  props.handleChange(e);
                }}
              />
              <FieldItem
                label="Phone"
                fieldName="phone"
                onChange={(e) => {
                  console.log(e.target.value);
                  form.setPhone(e.target.value);
                  props.handleChange(e);
                }}
              />
              <FieldItem
                label="Post Code"
                fieldName="postCode"
                onChange={(e) => {
                  console.log(e.target.value);
                  form.setPhone(e.target.value);
                  props.handleChange(e);
                }}
              />
              <Field as={CustomSelect} name="size" label="Select Shirt Size" />
              <div className="divider">Emergency Contact</div>
              <FieldItem
                label="Name"
                fieldName="emergencyContact.name"
                onChange={(e) => {
                  console.log(e.target.value);
                  form.setPhone(e.target.value);
                  props.handleChange(e);
                }}
              />
              <FieldItem
                label="Phone"
                fieldName="emergencyContact.phone"
                onChange={(e) => {
                  console.log(e.target.value);
                  form.setPhone(e.target.value);
                  props.handleChange(e);
                }}
              />
              <div className="mt-8">
                <button type="submit" className={styles.button}>
                  Register
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default observer(Step1);

export const FieldItem = ({ label, fieldName, onChange }) => {
  return (
    <>
      <Field
        as={CustomInputComponent}
        id={fieldName}
        name={fieldName}
        label={label}
        onChange={onChange}
      />
      <ErrorMessage
        component="a"
        className={styles.errorMsg}
        name={fieldName}
      />
    </>
  );
};

const CustomInputComponent = (props) => (
  <div className="form-control w-full max-w-xs">
    <label className="label">
      <span className="label-text">{props.label}</span>
    </label>
    <input
      type="text"
      className="input input-bordered w-full max-w-xs"
      {...props}
    />
  </div>
);

const CustomSelect = (props) => (
  <div className="form-control w-full max-w-xs">
    <label className="label">
      <span className="label-text">Select your shirt size</span>
    </label>
    <select className="select select-bordered" {...props}>
      <option disabled selected>
        Pick one
      </option>
      <option>XS</option>
      <option>Small</option>
      <option>Medium</option>
      <option>Large</option>
      <option>XLarge</option>
    </select>
  </div>
);
/*
  <form className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              First Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="Jane"
            />
            <p className="text-red-500 text-xs italic">
              Please fill out this field.
            </p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Last Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              placeholder="Doe"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Password
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="password"
              placeholder="******************"
            />
            <p className="text-gray-600 text-xs italic">
              Make it as long and as crazy as you'd like
            </p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              City
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-city"
              type="text"
              placeholder="Albuquerque"
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              State
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
              >
                <option>New Mexico</option>
                <option>Missouri</option>
                <option>Texas</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-zip"
            >
              Zip
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-zip"
              type="text"
              placeholder="90210"
            />
          </div>
        </div>
      </form>
*/
