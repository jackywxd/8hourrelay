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
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
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
                <div className="grid md:grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="first-name">First name</Label>
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
                    <Label htmlFor="last-name">Last name</Label>
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
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
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
                  <Label htmlFor="preferName">Prefer name</Label>
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
                  <Label htmlFor="birthYear">Year of birth</Label>
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
                <Button disabled={loading ? true : false} type="submit">
                  {store.userStore.isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.save className="mr-2 h-4 w-4" />
                  )}{" "}
                  Save
                </Button>
              </CardFooter>
            </Card>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default observer(ProfileForm);
