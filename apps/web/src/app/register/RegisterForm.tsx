"use client";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button } from "@material-tailwind/react";

import SelectComponent from "@/components/SelecComponent";
import { registerStore } from "@8hourrelay/store";
import SelectTeam from "./SelectTeam";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { RaceEntry, event2023 } from "@8hourrelay/models";

function RegisterForm({ team }: { team?: string }) {
  const router = useRouter();
  const initialValues = registerStore.initRaceEntryForm(team);
  const SignupSchema = Yup.object().shape({
    firstName: Yup.string().max(50, "Too Long!").required("Required"),
    lastName: Yup.string().max(50, "Too Long!").required("Required"),
    email: Yup.string().email().required("Required"),
    race: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    birthYear: Yup.string().required("Required"),
    team: Yup.string().required("Required"),
    teamPassword: Yup.string().required("Required"),
    emergencyName: Yup.string().required("Required"),
    emergencyPhone: Yup.string().required("Required"),
    accepted: Yup.boolean().required("Required"),
  });

  const onSubmit = async (values) => {
    console.log(`Register Form data`, { values });
    const form = { ...values };
    if (!registerStore.teamValidated) {
      if (
        !(await registerStore.validateTeamPassword(
          values.team,
          values.teamPassword
        ))
      ) {
        return;
      }
    }
    registerStore.setForm(form);
    registerStore.setState("FORM_SUBMITTED");
  };

  const onDelete = async () => {
    await registerStore.deleteRaceEntry();
    registerStore.setState("INIT");
  };

  const onCancel = () => {
    registerStore.setForm(null);
    router.push("/register");
  };

  const genderOptions = ["Male", "Femal"].map((m) => ({ value: m, label: m }));
  const shirtSizeOptions = ["XS", "Small", "Medium", "Large", "XLarge"].map(
    (m) => ({ value: m, label: m })
  );
  const raceOptions = registerStore.event.races.map((race) => ({
    value: race.name,
    label: race.description,
    entryFee: race.entryFee,
  }));

  console.log(`initalvalue`, {
    initialValues,
    isLoading: registerStore.isLoading,
  });
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="divider">Basic Info</div>

      <div className="flex flex-wrap min-w-full -mx-3 mb-6 items-center justify-center">
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          validate={(values) => {
            // console.log(`validating forms data`, { values });
            let errors = {};

            errors = registerStore.validateForm(values as RaceEntry);
            return errors;
          }}
          onSubmit={async (values) => await onSubmit(values)}
        >
          {(props) => (
            <Form className="flex flex-col w-72 items-end gap-6">
              {/* {fee && <div>{`Entery fee: ${props.values.race}`}</div>} */}
              <SelectComponent
                disabled={registerStore.editIndex !== null ? true : false}
                validate={(value) => {
                  console.log(`race value`, value);
                  if (value) registerStore.setTeamFilter(value);
                }}
                options={raceOptions}
                label="Select Race"
                name="race"
                {...props}
              />
              <FieldItem label="Email*" fieldName="email" />
              <FieldItem label="First Name*" fieldName="firstName" />
              <FieldItem label="Last Name*" fieldName="lastName" />
              <FieldItem label="Prefer Name" fieldName="preferName" />
              <SelectComponent
                options={genderOptions}
                label="Gender"
                name="gender"
                {...props}
              />
              <FieldItem label="Phone*" fieldName="phone" />
              <FieldItem label="Year of birth*" fieldName="birthYear" />
              <FieldItem label="Personal Best Time" fieldName="personalBest" />
              <SelectComponent
                options={shirtSizeOptions}
                label="Select Shirt Size"
                name="size"
                {...props}
              />
              <div className="divider">Team Info</div>

              <Suspense fallback={Loader}>
                <SelectTeam name="team" team={team} />
              </Suspense>
              <FieldItem label="Team Password*" fieldName="teamPassword" />
              <div className="divider">Emergency Contact</div>
              <FieldItem label="Name*" fieldName="emergencyName" />
              <FieldItem label="Phone*" fieldName="emergencyPhone" />
              <div className="divider"></div>
              <FieldCheckBox label="Accepte race wavier" fieldName="accepted" />
              <div className="flex w-full justify-between gap-2">
                <Button
                  className="!btn-primary"
                  type="submit"
                  fullWidth
                  disabled={
                    props.values.accepted === false || registerStore.isLoading
                      ? true
                      : false
                  }
                >
                  Next
                </Button>

                <Button
                  fullWidth
                  onClick={onCancel}
                  disabled={registerStore.isLoading ? true : false}
                >
                  return
                </Button>
                {registerStore.editIndex !== null && // edit current race entry is not paid yet, user can delete it
                  !registerStore.raceEntry?.isPaid && (
                    <Button
                      fullWidth
                      onClick={onDelete}
                      disabled={registerStore.isLoading ? true : false}
                    >
                      delete
                    </Button>
                  )}
              </div>

              {/* <AutoSubmitToken /> */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default observer(RegisterForm);

export const FieldItem = ({ label, fieldName, ...props }) => {
  return (
    <div>
      <Field
        as={CustomInputComponent}
        id={fieldName}
        name={fieldName}
        label={label}
        {...props}
      />
      <ErrorMessage name={fieldName}>
        {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
      </ErrorMessage>
    </div>
  );
};

export const FieldCheckBox = ({ label, fieldName, ...props }) => {
  return (
    <>
      <Field as={CustomCheckBox} label={label} name={fieldName} {...props} />
      <ErrorMessage name={fieldName}>
        {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
      </ErrorMessage>
    </>
  );
};
const CustomCheckBox = (props) => {
  return (
    <div className="form-control mt-3">
      <label className="label cursor-pointer gap-3">
        <span className="label-text">{props.label}</span>
        <input
          type="checkbox"
          checked={props.value}
          className="checkbox checkbox-md checkbox-primary"
          {...props}
        />
      </label>
    </div>
  );
};

const CustomInputComponent = (props) => (
  <div className="flex flex-col w-72 items-end gap-6">
    {/* <label className="label">
      <span className="label-text">{props.label}</span>
    </label> */}
    <Input
      type="text"
      className="input input-primary w-full max-w-xs"
      {...props}
    />
  </div>
);
