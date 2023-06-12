"use client";
import { useEffect, useState, useTransition } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { sendMessage } from "./sendMsgActions";
const init = {
  name: "",
  email: "",
  messages: "",
};
function MessageForm() {
  const [pending, startTransition] = useTransition();
  const [initialValues, setInitialValues] = useState(init);
  const [success, setSuccess] = useState(false);
  const MessageSchema = Yup.object().shape({
    name: Yup.string().max(50, "Too Long!").required("Required"),
    email: Yup.string().email().required("Required"),
    messages: Yup.string().required("Required"),
  });

  useEffect(() => {
    if (success && !pending) setInitialValues(init);
  }, [success, pending]);

  const onSubmit = async (values, action) => {
    if (pending || success) {
      action.resetForm();
      return;
    }
    startTransition(async () => {
      await sendMessage(values);
      setSuccess(true);
      action.resetForm();
    });
  };
  return (
    <div className="flex flex-col self-center items-center">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 ">
            Send us messages
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Have question? Need some help? Send us messages and we will get back
            to you shortly.
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={MessageSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 "
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      value={props.values.name}
                      onChange={props.handleChange}
                      type="text"
                      name="name"
                      id="first-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <ErrorMessage name="name">
                    {(msg) => (
                      <p className="mt-2 text-sm text-red-600">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 "
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      value={props.values.email}
                      onChange={props.handleChange}
                      name="email"
                      id="email"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <ErrorMessage name="email">
                    {(msg) => (
                      <p className="mt-2 text-sm text-red-600">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="messages"
                    className="block text-sm font-medium leading-6 "
                  >
                    Messages
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={4}
                      value={props.values.messages}
                      onChange={props.handleChange}
                      id="messages"
                      name="messages"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <ErrorMessage name="messages">
                    {(msg) => (
                      <p className="mt-2 text-sm text-red-600">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>

                <div className="col-span-full"></div>
              </div>

              <div className="mt-8 flex w-full">
                <button className="btn btn-primary w-1/2">
                  {pending ? (
                    <span className="loading loading-ring loading-md"></span>
                  ) : success ? (
                    `Sent successfully`
                  ) : (
                    `Send`
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default MessageForm;
