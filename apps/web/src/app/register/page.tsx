"use client";
import { ActivityIndicator, Surface, TextInput } from "react-native-paper";
import { loadStripe } from "@stripe/stripe-js";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";

import { Button } from "ui";
import Register from "../../content/register.mdx";
import { useAuth } from "@/context/AuthContext";
import { LoginWithEmailScreen } from "@8hourrelay/login";
import Step1 from "./Step1";
import Login from "./Login";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
const styles = {
  label: "block text-sm font-bold pt-2 pb-1",
  field:
    "bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none",
  button: "btn btn-primary py-2 px-4 w-full",
  errorMsg: "text-red-500 text-sm",
};

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { store } = useAuth();
  const { authStore, userStore, registerStore } = store;

  const [state, setState] = useState("init");

  const sessionId = searchParams.get("session_id");
  const apiKey = searchParams.get("apiKey");
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  // user completed the payment will trigger below event
  useEffect(() => {
    const getCustomer = async () => {
      if (sessionId) {
        const result = await registerStore.getStripeSession(sessionId);
        console.log(`Get Session ID result`, result);
        setState("");
      }
    };
    getCustomer();
  }, [success, sessionId]);

  // use click on login link will trigger below event
  useEffect(() => {
    async function siginin() {
      if (apiKey && typeof window !== "undefined") {
        // const fullURL = `${window.location.protocol}//${window.location.hostname}${asPath}`;
        const fullUrl = window.location.href;
        if (authStore.email && fullUrl) {
          await authStore.signinWithEmailLink(fullUrl);
          router.push("/register?continue");
        }
      }
    }
    siginin();
  }, [apiKey]);

  const onRegister = async ({ email }) => {
    registerStore.setEmail(email);
    const [stripe, response] = await Promise.all([
      stripePromise,
      registerStore.createCheckOutSession(),
    ]);
    console.log(`response`, response);
    if (stripe && response?.id) {
      await stripe.redirectToCheckout({ sessionId: response.id });
      setState("IN_PROGRESS");
    }
  };

  if (canceled) {
    return <div>Your payment canceled!</div>;
  }
  if (success && sessionId) {
    return (
      <div className="flex h-full">
        <div>You successfully registered! Now </div>
      </div>
    );
  }

  if (store.isLoading) {
    return <div>Loading...</div>;
  }
  // if no logined user yet
  if (!userStore.user) {
    return (
      <div className="w-full md:max-w-[800px] h-full">
        {authStore.state === "INIT" && (
          <>
            <div className="text-center text-lg pt-10">
              Please login to register to a race. Enter your email and will send
              you a login link
            </div>
            <Login />
          </>
        )}
        {authStore.state === "EMAIL_LINK_SENT" && (
          <div>
            Check your email {authStore.email} and click the link to continue
            the register
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center pt-10">
      {/* <div className="prose mx-2"> */}
      {/* <Register /> */}
      {/* </div> */}
      <Step1 />
    </div>
  );
}

export default observer(Page);
