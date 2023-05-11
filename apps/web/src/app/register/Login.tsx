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

function Step1() {
  const { store } = useAuth();

  const onLogin = async (email) => {
    await store.authStore.sendLoginEmailLink(email);
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
          <label className={styles.label} htmlFor="Email">
            Email
          </label>
          <Field className={styles.field} id="email" name="email" />
          <ErrorMessage
            component="a"
            className={styles.errorMsg}
            name="email"
          />
          <div className="mt-8">
            <button type="submit" className={styles.button}>
              Send Login Link
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default observer(Step1);
