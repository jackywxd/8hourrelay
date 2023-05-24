import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button } from "@material-tailwind/react";

import SelectComponent from "@/components/SelecComponent";
import { observer } from "mobx-react-lite";
import { teamStore } from "@8hourrelay/store/src/UIStore";

function CreateTeamForm() {
  const initialValues = teamStore.initialTeamForm();
  const router = useRouter();
  const SignupSchema = Yup.object().shape({
    name: Yup.string().max(50, "Too Long!").required("Required"),
    captainName: Yup.string().max(50, "Too Long!").required("Required"),
    race: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    slogon: Yup.string(),
  });

  const onSubmit = async (values) => {
    console.log(`Submitting team form`, { values });
    teamStore.setForm(values);
    teamStore.setState("CONFIRM");
  };

  const onCancel = () => {
    router.push("/teams");
  };

  const raceOptions = teamStore.event.races.map((race) => ({
    value: race.name,
    label: race.description,
    entryFee: race.entryFee,
  }));

  return (
    <div className="w-full items-center mt-8">
      <div className="divider">Create Team</div>
      <div className="flex flex-wrap min-w-full -mx-3 mb-6">
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form className="flex w-full flex-col gap-6 justify-center items-center">
              <SelectComponent
                options={raceOptions}
                label="Select Race"
                name="race"
                {...props}
              />
              <FieldItem label="Team Name*" fieldName="name" />
              <FieldItem label="Team Password*" fieldName="password" />
              <FieldItem label="Captain Name*" fieldName="captainName" />
              <FieldItem label="Slogan" fieldName="slogan" />

              <div className="flex flex-row w-full justify-between">
                <button className="btn" onClick={onCancel}>
                  cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  create
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default observer(CreateTeamForm);

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
