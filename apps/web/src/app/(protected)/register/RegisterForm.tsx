"use client";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import SelectComponent from "@/components/SelecComponent";
import { registerStore } from "@8hourrelay/store";
import SelectTeam from "./SelectTeam";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { RaceEntry, Team, event2023 } from "@8hourrelay/models";
import Link from "next/link";
import { FieldCheckBox } from "@/components/CustomFiled";
import { FieldItem } from "@/components/CustomFiled";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wavier } from "./ShowWavier";

function RegisterForm({ team }: { team?: Team }) {
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
      registerStore.setForm(form);
      if (
        !(await registerStore.validateTeamPassword(
          values.team,
          values.teamPassword
        ))
      ) {
        return;
      }
    }
    registerStore.setState("FORM_SUBMITTED");
  };

  const onDelete = async () => {
    await registerStore.deleteRaceEntry();
    registerStore.setState("INIT");
  };

  const onCancel = () => {
    registerStore.reset();
    router.push("/register");
  };

  console.log(`initalvalue`, {
    initialValues,
    isLoading: registerStore.isLoading,
  });
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-wrap min-w-full mb-6 items-center justify-center">
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          enableReinitialize
          validate={(values) => {
            console.log(`validating forms data`, { values });
            let errors = {};
            errors = registerStore.validateForm(values as RaceEntry);
            return errors;
          }}
          onSubmit={async (values) => await onSubmit(values)}
        >
          {(props) => (
            <Form className="flex flex-col w-full justify-center gap-8 items-center">
              <Card>
                <CardHeader>
                  <CardTitle>Select Race</CardTitle>
                  <CardDescription>
                    Select the race you would like to register
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <SelectComponent
                    {...props}
                    disabled={
                      team || registerStore.editIndex !== null ? true : false
                    }
                    validate={(value) => {
                      console.log(`race value`, value);
                      if (value && registerStore.teamFilter !== value) {
                        registerStore.setTeamFilter(value);
                        props.values.team = "";
                      }
                    }}
                    options={registerStore.raceOptions}
                    label="Select Race"
                    required
                    name="race"
                  />
                </CardContent>
                {registerStore.teamFilter ? (
                  <>
                    <CardHeader>
                      <CardTitle>Team Info</CardTitle>
                      <CardDescription>
                        Please select team and enter the team password. If you
                        don't know the team password, contact team captain. You
                        can create your own team.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Suspense fallback={Loader}>
                        <SelectTeam
                          {...props}
                          required
                          name="team"
                          label="Select team"
                          team={team ? team.name : undefined}
                        />
                      </Suspense>
                      <FieldItem
                        label="Team Password"
                        fieldName="teamPassword"
                        required
                      />
                    </CardContent>
                  </>
                ) : null}
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Select the race you would like to register and provide your
                    personal data, * fields are required.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-2">
                    <FieldItem label="Email" required fieldName="email" />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FieldItem
                        label="First Name"
                        required
                        fieldName="firstName"
                      />
                      <FieldItem
                        label="Last Name"
                        required
                        fieldName="lastName"
                      />
                    </div>
                    <FieldItem label="Prefer Name" fieldName="preferName" />
                    <SelectComponent
                      {...props}
                      options={registerStore.genderOptions}
                      required
                      label="Gender"
                      name="gender"
                    />
                    <FieldItem label="Phone" required fieldName="phone" />
                    <FieldItem
                      label="Year of birth"
                      required
                      fieldName="birthYear"
                    />

                    <FieldItem
                      label="Personal Best Time"
                      fieldName="personalBest"
                    />
                    <SelectComponent
                      {...props}
                      options={registerStore.shirtSizeOptions}
                      label="Select Shirt Size"
                      name="size"
                    />
                  </div>
                </CardContent>
                <CardHeader>
                  <CardTitle> Emergency Contact</CardTitle>
                  <CardDescription>
                    Emergency contact name and mobile phone number
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <FieldItem
                        label="Name"
                        fieldName="emergencyName"
                        required
                      />
                    </div>
                    <FieldItem
                      label="Phone"
                      fieldName="emergencyPhone"
                      required
                    />
                  </div>
                </CardContent>

                <CardContent>
                  <div className="flex w-full justify-between items-center">
                    <div>
                      Accept <Wavier />
                    </div>
                    <div>
                      <FieldCheckBox label="" fieldName="accepted" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between space-x-2">
                  <Button
                    type="submit"
                    disabled={
                      props.values.accepted === false || registerStore.isLoading
                        ? true
                        : false
                    }
                  >
                    Next
                  </Button>

                  <Button
                    onClick={onCancel}
                    disabled={registerStore.isLoading ? true : false}
                  >
                    Return
                  </Button>
                  {registerStore.editIndex !== null && // edit current race entry is not paid yet, user can delete it
                    !registerStore.raceEntry?.isPaid && (
                      <Button
                        onClick={onDelete}
                        disabled={registerStore.isLoading ? true : false}
                      >
                        Delete
                      </Button>
                    )}
                </CardFooter>
              </Card>
              {/* <AutoSubmitToken /> */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default observer(RegisterForm);
