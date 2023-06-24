"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LoginFirst from "@/components/LoginFirst";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "@/components/Loading";
function ProfileForm() {
  const { store } = useAuth();
  const [loading, setLoading] = useState(store.userStore.isLoading);
  useEffect(() => {
    if (store.userStore.isLoading) setLoading(true);
    else setLoading(false);
  }, [store.userStore.isLoading]);
  const router = useRouter();
  const initialValues = {
    firstName: store.userStore.user?.firstName ?? "",
    lastName: store.userStore.user?.lastName ?? "",
    preferName: store.userStore.user?.preferName ?? "",
    phone: store.userStore.user?.phone ?? "",
    birthYear: store.userStore.user?.birthYear ?? "",
  };
  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().max(50, "Too Long!").required("Required"),
    lastName: Yup.string().max(50, "Too Long!").required("Required"),
    preferName: Yup.string(),
    phone: Yup.string(),
    birthYear: Yup.string().required("Required"),
  });

  const onSubmit = (values) => {
    console.log(`saveing new values`, values);
    store.userStore.onUpdateUser(values);
  };
  if (!store.authStore.isAuthenticated) return <LoginFirst />;

  console.log(`isLoading value`, store.userStore.isLoading);
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={ProfileSchema}
        enableReinitialize
        validate={(values) => {
          console.log(`validating forms data`, { values });
          let errors = {};
          errors = store.userStore.validateForm(values);
          return errors;
        }}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Please enter your full name or a display name you are
                  comfortable with.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label htmlFor="first-name">
                    <span>First name</span>
                  </label>
                  <Input
                    value={props.values.firstName}
                    onChange={props.handleChange}
                    type="text"
                    name="firstName"
                    id="first-name"
                    autoComplete="given-name"
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                  <ErrorMessage name="firstName">
                    {(msg) => (
                      <div className="text-sm text-red-400 error-msg">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div className="">
                  <label htmlFor="last-name">
                    <span>Last name</span>
                  </label>
                  <Input
                    value={props.values.lastName}
                    onChange={props.handleChange}
                    type="text"
                    name="lastName"
                    id="last-name"
                    autoComplete="family-name"
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                  <ErrorMessage name="lastName">
                    {(msg) => (
                      <div className="text-sm text-red-400 error-msg">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div>
                  <label htmlFor="phone">
                    <span>Phone</span>
                  </label>

                  <Input
                    value={props.values.phone}
                    onChange={props.handleChange}
                    id="phone"
                    name="phone"
                    type="text"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                  />

                  <ErrorMessage name="phone">
                    {(msg) => (
                      <div className="text-sm text-red-400 error-msg">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div>
                  <label htmlFor="preferName">
                    <span>Preferred Name</span>
                  </label>
                  <Input
                    value={props.values.preferName}
                    onChange={props.handleChange}
                    type="text"
                    name="preferName"
                    id="preferName"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="birthYear">
                    <span>Year of Birth</span>
                  </label>
                  <Input
                    value={props.values.birthYear}
                    onChange={props.handleChange}
                    type="text"
                    name="birthYear"
                    id="birthYear"
                    autoComplete="username"
                  />
                  <ErrorMessage name="birthYear">
                    {(msg) => (
                      <div className="text-sm text-red-400 error-msg">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={loading ? true : false}
                  type="submit"
                  className="btn btn-large btn-primary blue"
                >
                  {loading ? <Loading /> : `Save`}
                </Button>
              </CardFooter>
            </Card>
          </Form>
        )}
      </Formik>

      {/* <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 ">Delete account</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            No longer want to use our service? You can delete your account here.
            This action is not reversible. All information related to this
            account will be deleted permanently.
          </p>
        </div>

        <form className="md:col-span-2">
          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-full w-full bg-red-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-red-400"
            >
              Yes, delete my account
            </button>
          </div>
        </form>
      </div> */}
    </>
  );
}

export default observer(ProfileForm);
