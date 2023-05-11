"use client";
import { loadStripe } from "@stripe/stripe-js";
import dynamic from "next/dynamic";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@material-tailwind/react";

import { useAuth } from "@/context/AuthContext";
import { RaceEntry } from "@8hourrelay/models";

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

export type REGISTER_STATE =
  | "INIT"
  | "NOT_AUTHENTICATED"
  | "LOGINED"
  | "FORM_SUBMITTED"
  | "PAID"
  | "LOADING"
  | "CANCELED_PAY";

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id"); // payment succeed
  const success = searchParams.get("success"); // payment succeed
  const canceled = searchParams.get("canceled"); // payment canceled
  const apiKey = searchParams.get("apiKey");

  const { store } = useAuth();
  const [form, setForm] = useState<RaceEntry | null>(null);
  const [state, setState] = useState<REGISTER_STATE>(() => {
    if (!store.authStore.currentUser) return "NOT_AUTHENTICATED";
    if (store.userStore.user) return "LOGINED";
    if (store.authStore.currentUser && !store.userStore.user) return "LOADING";
    if (sessionId && success) return "PAID";
    if (canceled) return "CANCELED_PAY";
    return "INIT";
  });

  // use click on login link will trigger below event
  useEffect(() => {
    async function sigininWithEmail() {
      if (typeof window !== "undefined") {
        const fullUrl = window.location.href;
        await store.authStore.signinWithEmailLink(fullUrl);
      }
    }
    sigininWithEmail();
  }, []);

  // use click on login link will trigger below event
  useEffect(() => {
    if (store.authStore.state === "VERFIED") {
      // store.authStore.setState("LOGINED");
      router.push("/register");
    }
    if (store.userStore.user) setState("LOGINED");
  }, [store.authStore.state, store.userStore.user]);

  // form filled, then submit it to backend to get the checkout session Id
  const onSubmit = async () => {
    console.log(`Paying...`, { form });
    const [stripe, sessionId] = await Promise.all([
      stripePromise,
      store.userStore.submitRaceForm(form!),
    ]);
    // redirect user to Stripe Checkout for payment
    if (stripe && sessionId) {
      stripe.redirectToCheckout({ sessionId: sessionId.id });
    }
  };

  if (state === "CANCELED_PAY") {
    return <div>Your payment canceled!</div>;
  }

  // payment succeed, we should continue the team register
  if (state === "PAID") {
    return (
      <div className="flex h-full">
        <div>You successfully registered! Now You can </div>
      </div>
    );
  }

  // if no logined user yet
  if (state === "NOT_AUTHENTICATED") {
    const Login = dynamic(() => import("./Login"), { ssr: false });
    const Email = dynamic(() => import("./Email"), { ssr: false });

    return (
      <div className="w-full md:max-w-[800px] h-full">
        {store.authStore.state === "INIT" ? (
          <>
            <div className="text-center text-lg pt-10">
              Please login to register to a race. Enter your email and will send
              you a login link
            </div>
            <Login />
          </>
        ) : store.authStore.state === "EMAIL_LINK_SENT" ? (
          <div>
            Check your email {store.authStore.email} and click the link to
            continue the register
          </div>
        ) : store.authStore.state === "MISSING_EMAIL" ? (
          <div className="text-center text-lg pt-10">
            <div className="text-center text-lg pt-10">
              Please provide your email for confirmation
            </div>
            <Email />
          </div>
        ) : (
          <div className="flex items-end gap-8">
            <Spinner className="h-12 w-12" />
          </div>
        )}
      </div>
    );
  }

  if (state === "FORM_SUBMITTED" && form) {
    const Confirm = dynamic(() => import("./ConfirmPayment"), {
      ssr: false,
    });
    // user logged in and authStore has been fullfilled with user data
    return (
      <div className="flex flex-col justify-center pt-10">
        <Confirm raceEntry={form} onSubmit={onSubmit} />
      </div>
    );
  }
  const RegisterForm = dynamic(() => import("./RegisterForm"), { ssr: false });
  // user logged in and authStore has been fullfilled with user data
  return (
    <div className="flex flex-col justify-center pt-10">
      <RegisterForm
        onSubmit={(values) => {
          console.log(`Register Form data`, { values });
          const form = new RaceEntry(values);
          setForm(form);
          setState("FORM_SUBMITTED");
        }}
      />
    </div>
  );
}

export default observer(Page);
