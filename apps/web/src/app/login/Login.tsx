import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button } from "@material-tailwind/react";

function Login({ mode, onSubmit }) {
  const emailSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  return (
    <div className="flex flex-col w-full justify-center">
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={emailSchema}
        onSubmit={(values) => onSubmit(values.email)}
      >
        <Form className="flex w-full justify-center">
          <div className="flex flex-col w-96 gap-10">
            <Field
              as={Input}
              label="Email"
              id="email"
              name="email"
              className="!input-primary !input-lg"
            />
            <ErrorMessage component="a" name="email" />
            <Button type="submit" className="!btn-primary my-8">
              {mode === "login" ? `Send Login Link` : `Confirm Email`}
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Login;
