"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  console.log(`isLoading value`, store.userStore.isLoading);
  return (
    <>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 ">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400"></p>
        </div>
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
            <Form className="md:col-span-2">
              <div className="flex w-full justify-between mb-5">
                <div>Email:</div>
                <div>{store.userStore.user?.email}</div>
              </div>
              <div className="divider"></div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 "
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      value={props.values.firstName}
                      onChange={props.handleChange}
                      type="text"
                      name="firstName"
                      id="first-name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <ErrorMessage name="firstName">
                    {(msg) => (
                      <p className="mt-2 text-sm text-red-600">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium leading-6 "
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      value={props.values.lastName}
                      onChange={props.handleChange}
                      type="text"
                      name="lastName"
                      id="last-name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <ErrorMessage name="lastName">
                    {(msg) => (
                      <p className="mt-2 text-sm text-red-600">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 "
                  >
                    Phone
                  </label>
                  <div className="mt-2">
                    <input
                      value={props.values.phone}
                      onChange={props.handleChange}
                      id="phone"
                      name="phone"
                      type="text"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <ErrorMessage name="phone">
                    {(msg) => (
                      <p className="mt-2 text-sm text-red-600">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="preferName"
                    className="block text-sm font-medium leading-6 "
                  >
                    Prefer Name
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <input
                        value={props.values.preferName}
                        onChange={props.handleChange}
                        type="text"
                        name="preferName"
                        id="preferName"
                        autoComplete="username"
                        className="flex-1 border-0 bg-transparent py-1.5 pl-1  focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="birthYear"
                    className="block text-sm font-medium leading-6 "
                  >
                    Year of Birth
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <input
                        value={props.values.birthYear}
                        onChange={props.handleChange}
                        type="text"
                        name="birthYear"
                        id="birthYear"
                        autoComplete="username"
                        className="flex-1 border-0 bg-transparent py-1.5 pl-1  focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <ErrorMessage name="birthYear">
                      {(msg) => (
                        <p className="mt-2 text-sm text-red-600">{msg}</p>
                      )}
                    </ErrorMessage>
                  </div>
                </div>
                <div className="col-span-full"></div>
              </div>

              <div className="mt-8 flex">
                <button
                  disabled={loading ? true : false}
                  type="submit"
                  className="rounded-full w-full bg-indigo-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    `Save`
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 ">Log Out</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Clean current session and log out your account
          </p>
        </div>

        <form className="md:col-span-2">
          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-full w-full bg-indigo-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={() => {
                store.authStore.logout();
                router.push("/");
              }}
            >
              Log Out
            </button>
          </div>
        </form>
      </div>
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
