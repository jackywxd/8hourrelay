"use client";
import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { Spinner, Input, Button } from "@material-tailwind/react";
import AsyncStorage from "@react-native-community/async-storage";

import SelectComponent from "@/components/SelecComponent";
import { entryFormSnapshot } from "@8hourrelay/store/src/RootStore";

function RegisterForm({
  onSubmit,
  onCancel,
  onDelete,
  raceEntry,
  raceOptions,
}) {
  const [initialValues, setInitValues] = useState(null);

  // load local form data and reset the form init values
  useEffect(() => {
    const init = async () => {
      const data = await AsyncStorage.getItem(entryFormSnapshot);
      if (data) {
        console.log(`loading new data`, { data });
        const newValue = JSON.parse(data);
        setInitValues({ ...newValue });
      }
    };
    init();
  }, []);

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string().max(50, "Too Long!").required("Required"),
    lastName: Yup.string().max(50, "Too Long!").required("Required"),
    email: Yup.string().email().required("Required"),
    race: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    birthYear: Yup.string().required("Required"),
    emergencyName: Yup.string().required("Required"),
    emergencyPhone: Yup.string().required("Required"),
  });

  // const fee = store.eventStore.event.races.filter(
  //   (f) => f.name === initialValues.race
  // )?.[0]?.entryFee;

  const genderOptions = ["Male", "Femal"].map((m) => ({ value: m, label: m }));
  const shirtSizeOptions = ["XS", "Small", "Medium", "Large", "XLarge"].map(
    (m) => ({ value: m, label: m })
  );

  return (
    <div className="w-full max-w-lg">
      <div className="divider">Basic Info</div>

      <div className="flex flex-wrap min-w-full -mx-3 mb-6">
        <Formik
          initialValues={initialValues ? initialValues : raceEntry}
          validationSchema={SignupSchema}
          enableReinitialize
          onSubmit={(values) => onSubmit(values)}
        >
          {(props) => (
            <Form className="flex flex-col w-72 items-end gap-6">
              {/* {fee && <div>{`Entery fee: ${props.values.race}`}</div>} */}
              <SelectComponent
                disabled={raceEntry?.isPaid}
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
              <div className="divider">Emergency Contact</div>
              <FieldItem label="Name*" fieldName="emergencyName" />
              <FieldItem label="Phone*" fieldName="emergencyPhone" />
              <div className="flex w-full justify-between gap-2">
                <Button
                  className="!btn-primary"
                  type="submit"
                  fullWidth
                  disabled={props.isValid ? false : true}
                >
                  {raceEntry?.isPaid ? `Update Info` : `Review & Payment`}
                </Button>
                <Button fullWidth onClick={onCancel}>
                  cancel
                </Button>
                {onDelete && (
                  <Button fullWidth onClick={onDelete}>
                    delete
                  </Button>
                )}
              </div>
              <AutoSubmitToken />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RegisterForm;

const AutoSubmitToken = () => {
  // Grab values and submitForm from context
  const { values, submitForm, dirty, isValid } = useFormikContext();
  useEffect(() => {
    if (!dirty || !isValid) return;
    console.log(`updating....`, values);
    const jsonData = JSON.stringify(values);
    AsyncStorage.setItem(entryFormSnapshot, jsonData);
    // Submit the form imperatively as an effect as soon as form values.token are 6 digits long
    // submitForm();
  }, [values]);
  return null;
};

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
