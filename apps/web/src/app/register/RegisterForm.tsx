"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { Spinner } from "@material-tailwind/react";
import AsyncStorage from "@react-native-community/async-storage";
import { loadStripe } from "@stripe/stripe-js";

import { useAuth } from "@/context/AuthContext";
import SelectComponent from "@/components/SelecComponent";
import { entryFormSnapshot } from "@8hourrelay/store/src/RootStore";
import { RaceEntry } from "@8hourrelay/models";

const styles = {
  label: "block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2",
  field:
    "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500",
  button: "btn btn-primary py-2 px-4 w-full",
  errorMsg: "text-red-500 text-sm",
};

function RegisterForm({ onSubmit }) {
  const {
    store: { userStore, event },
  } = useAuth();
  const { uid, user, raceEntry } = userStore;
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitValues] = useState<Omit<RaceEntry, "entryFee">>(
    () => {
      return {
        year: raceEntry?.year ?? event.year,
        uid: uid!,
        email: raceEntry?.email ?? user?.email ?? "",
        firstName: raceEntry?.firstName ?? user?.firstName ?? "",
        lastName: raceEntry?.lastName ?? user?.lastName ?? "",
        preferName: raceEntry?.preferName ?? "",
        phone: raceEntry?.phone ?? user?.phone,
        gender: raceEntry?.gender ?? user?.gender,
        wechatId: raceEntry?.wechatId ?? user?.wechatId,
        birthYear: raceEntry?.birthYear ?? user?.birthYear,
        personalBest: raceEntry?.personalBest ?? user?.personalBest,
        race: raceEntry?.race ?? "",
        size: raceEntry?.size ?? "",
        emergencyName: raceEntry?.emergencyName ?? "",
        emergencyPhone: raceEntry?.emergencyPhone ?? "",
        isActive: raceEntry?.isActive ?? true,
      };
    }
  );

  // load local form data and reset the form init values
  useEffect(() => {
    const init = async () => {
      const data = await AsyncStorage.getItem(entryFormSnapshot);
      if (data) {
        console.log(`loading new data`, { data });
        const newValue = JSON.parse(data);
        setInitValues({ ...initialValues, ...newValue });
      }
    };
    init();
  }, []);

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string().max(50, "Too Long!").required("Required"),
    lastName: Yup.string().max(50, "Too Long!").required("Required"),
    race: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    birthYear: Yup.string().required("Required"),
    emergencyName: Yup.string().required("Required"),
    emergencyPhone: Yup.string().required("Required"),
  });

  if (!event.races) {
    return null;
  }
  const raceOptions = event.races.map((race) => ({
    value: race.name,
    label: race.description,
    entryFee: race.entryFee,
  }));

  // const fee = store.eventStore.event.races.filter(
  //   (f) => f.name === initialValues.race
  // )?.[0]?.entryFee;

  const genderOptions = ["Male", "Femal"].map((m) => ({ value: m, label: m }));
  const shirtSizeOptions = ["XS", "Small", "Medium", "Large", "XLarge"].map(
    (m) => ({ value: m, label: m })
  );

  return (
    <div className="w-full max-w-lg">
      <div>Email: {user!.email}</div>
      <div className="divider">Basic Info</div>

      <div className="flex flex-wrap min-w-full -mx-3 mb-6">
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          enableReinitialize
          onSubmit={(values) => onSubmit(values)}
        >
          {(props) => (
            <Form>
              {/* {fee && <div>{`Entery fee: ${props.values.race}`}</div>} */}
              <SelectComponent
                options={raceOptions}
                label="Select Race"
                name="race"
                {...props}
              />
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
              <div className="mt-8">
                <button type="submit" className={styles.button}>
                  Review & Payment {loading && <Spinner />}
                </button>
              </div>
              <AutoSubmitToken />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default observer(RegisterForm);

const AutoSubmitToken = () => {
  // Grab values and submitForm from context
  const { values, submitForm, dirty } = useFormikContext();
  useEffect(() => {
    if (!dirty) return;
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
