"use client";
import { useEffect, useState, useTransition } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { sendMessage } from "./sendMsgActions";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";

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
    email: Yup.string().email("Invalid email!").required("Required"),
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
    <div className="content-container large text-white">
      <div className="contact-deck">
        Have question? Need some help?
        <p className="description">
          Send us messages and we will get back to you shortly.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={MessageSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form className="form">
            <div className="form-container">
              <div
                className={cn(
                  "input-container required",
                  props.values.email && "has-value"
                )}
              >
                <label htmlFor="name">
                  <span>Name</span>
                </label>
                <input
                  className={props.values.name && "has-value"}
                  value={props.values.name}
                  onChange={props.handleChange}
                  type="text"
                  name="name"
                  id="name"
                />
                <ErrorMessage name="name">
                  {(msg) => (
                    <div className="ml-2 text-sm text-red-400 error-msg">
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div
                className={cn(
                  "input-container required",
                  props.values.email && "has-value"
                )}
              >
                <label htmlFor="email">
                  <span>Email</span>
                </label>

                <input
                  className={props.values.email && "has-value"}
                  value={props.values.email}
                  onChange={props.handleChange}
                  type="email"
                  name="email"
                  id="email"
                />

                <ErrorMessage name="email">
                  {(msg) => (
                    <div className="ml-2 text-sm text-red-400 error-msg">
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div
                className={cn(
                  "input-container required textarea span-2",
                  props.values.messages && "has-value"
                )}
              >
                <label htmlFor="messages">
                  <span>Messages</span>
                </label>
                <textarea
                  value={props.values.messages}
                  onChange={props.handleChange}
                  id="messages"
                  name="messages"
                />

                <ErrorMessage name="messages">
                  {(msg) => (
                    <div className="ml-2 text-sm text-red-400 error-msg">
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div className="button-container mt-5 mb-20">
              <button className="btn btn-large btn-primary blue">
                {pending ? (
                  <div className="flex gap-1 items-center">
                    <Loading />
                    <span>Sending</span>
                  </div>
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
  );
}

export default MessageForm;
