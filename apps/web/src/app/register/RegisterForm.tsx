"use client";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button } from "@material-tailwind/react";

import SelectComponent from "@/components/SelecComponent";
import { registerStore } from "@8hourrelay/store";

function RegisterForm({ team }: { team?: string }) {
  const router = useRouter();
  const initialValues = registerStore.initRaceEntryForm(team);

  // load local form data and reset the form init values
  // useEffect(() => {
  //   const init = async () => {
  //     const data = await AsyncStorage.getItem(entryFormSnapshot);
  //     if (data) {
  //       console.log(`loading new data`, { data });
  //       const newValue = JSON.parse(data);
  //       setInitValues({ ...initialValues, ...newValue });
  //     }
  //   };
  //   init();
  // }, []);
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
      await registerStore.validateTeamPassword(
        values.team,
        values.teamPassword
      );
    }
    if (registerStore.teamValidated) {
      registerStore.setForm(form);
      registerStore.setState("FORM_SUBMITTED");
    }
  };

  const onDelete = async () => {
    await registerStore.deleteRaceEntry();
    router.refresh();
  };

  const onCancel = () => {
    if (team) router.push("/register");
    else registerStore.setState("INIT");
  };

  const onValidate = async (team: string, teamPassword: string) => {
    console.log(`Validate team password`, { team, teamPassword });
    await registerStore.validateTeamPassword(team, teamPassword);
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
    team: registerStore.teamValidated,
  });
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="divider">Basic Info</div>

      <div className="flex flex-wrap min-w-full -mx-3 mb-6 items-center justify-center">
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          enableReinitialize
          onSubmit={(values) => onSubmit(values)}
        >
          {(props) => (
            <Form className="flex flex-col w-72 items-end gap-6">
              {/* {fee && <div>{`Entery fee: ${props.values.race}`}</div>} */}
              <SelectComponent
                disabled={registerStore.editIndex !== null ? true : false}
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
              <FieldItem label="Team Name*" fieldName="team" />
              <FieldItem label="Team Password*" fieldName="teamPassword" />
              <div className="divider">Emergency Contact</div>
              <FieldItem label="Name*" fieldName="emergencyName" />
              <FieldItem label="Phone*" fieldName="emergencyPhone" />
              <div className="divider"></div>
              <FieldCheckBox label="Accepte race wavier" fieldName="accepted" />
              <div className="flex w-full justify-between gap-2">
                {!registerStore.raceEntry?.isPaid && (
                  <Button
                    className="!btn-primary"
                    type="submit"
                    fullWidth
                    disabled={
                      !props.isValid ||
                      props.values.accepted === false ||
                      registerStore.isLoading
                    }
                  >
                    Next
                  </Button>
                )}
                <Button fullWidth onClick={onCancel}>
                  return
                </Button>
                {registerStore.editIndex !== null && // edit current race entry is not paid yet, user can delete it
                  !registerStore.raceEntry?.isPaid && (
                    <Button fullWidth onClick={onDelete}>
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

// const AutoSubmitToken = () => {
//   // Grab values and submitForm from context
//   const { values, submitForm, dirty, isValid } = useFormikContext();
//   useEffect(() => {
//     if (!dirty || !isValid) return;
//     console.log(`updating....`, values);
//     if (values.teamPassword) delete values.teamPassword;
//     if (values.accepted) delete values.accepted;
//     const jsonData = JSON.stringify(values);
//     AsyncStorage.setItem(entryFormSnapshot, jsonData);
//     // Submit the form imperatively as an effect as soon as form values.token are 6 digits long
//     // submitForm();
//   }, [values]);
//   return null;
// };

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

export const FieldCheckBox = ({ label, fieldName, ...props }) => {
  return (
    <>
      <Field as={CustomCheckBox} label={label} name={fieldName} {...props} />
      <ErrorMessage component="a" name={fieldName} />
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
