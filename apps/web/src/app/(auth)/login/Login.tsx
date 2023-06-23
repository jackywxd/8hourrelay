import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

function Login({ initEmail, mode, onSubmit }) {
  const emailSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  return (
    <div className="flex flex-col w-full flex-1 justify-center">
      <Formik
        initialValues={{
          email: initEmail ?? "",
        }}
        validationSchema={emailSchema}
        onSubmit={(values) => onSubmit(values.email)}
      >
        <Form className="flex w-full justify-center">
          <div className="flex flex-col w-96 gap-10">
            <Field label="Email" id="email" name="email" className="input" />
            <ErrorMessage component="a" name="email" />
            <div className="flex flex-row w-full justify-around mt-8">
              <button type="submit" className="btn btn-primary w-full">
                {mode === "confirm" ? `Confirm` : `Next`}
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Login;
