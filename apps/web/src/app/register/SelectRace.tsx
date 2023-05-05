"use client";
import { observer } from "mobx-react-lite";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";

const styles = {
  label: "block text-sm font-bold pt-2 pb-1",
  field:
    "bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none",
  button: "btn btn-primary py-2 px-4 w-full",
  errorMsg: "text-red-500 text-sm",
};

function SelectRace() {
  const {
    store: { authStore },
  } = useAuth();
  const onLogin = async (email) => {
    if (typeof window === "object") {
      const fullUrl = window.location.href;
      await authStore.signinWithEmailLink(fullUrl, email);
    }
  };

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  return (
    <div className="flex flex-col w-full justify-center">
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          onLogin(values.email);
        }}
      >
        <Form>
          <Example />
        </Form>
      </Formik>
    </div>
  );
}
import { Select, Option } from "@material-tailwind/react";

function Example() {
  return (
    <div className="w-72">
      <Select label="Select Version">
        <Option>Material Tailwind HTML</Option>
        <Option>Material Tailwind React</Option>
        <Option>Material Tailwind Vue</Option>
        <Option>Material Tailwind Angular</Option>
        <Option>Material Tailwind Svelte</Option>
      </Select>
    </div>
  );
}
export default observer(SelectRace);
