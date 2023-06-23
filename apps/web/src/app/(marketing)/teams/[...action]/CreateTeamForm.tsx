import { Formik, Form } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import { observer } from "mobx-react-lite";

import SelectComponent from "@/components/SelecComponent";
import { teamStore } from "@8hourrelay/store/src/UIStore";
import { FieldItem } from "@/components/CustomFiled";

function CreateTeamForm() {
  const initialValues = teamStore.initialTeamForm();
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
                <Link href="/teams">
                  <button className="btn">cancel</button>
                </Link>
                <button type="submit" className="btn btn-primary">
                  Next
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
