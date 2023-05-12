"use client";
import { loadStripe } from "@stripe/stripe-js";
import dynamic from "next/dynamic";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner, Button } from "@material-tailwind/react";

import { useAuth } from "@/context/AuthContext";
import { RaceEntry } from "@8hourrelay/models";
import DisplayRegistration from "./DisplayRegistration";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export type REGISTER_STATE = "INIT" | "EDIT" | "FORM_SUBMITTED" | "DELETE";

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id"); // payment succeed
  const success = searchParams.get("success"); // payment succeed
  const canceled = searchParams.get("canceled"); // payment canceled
  const action = searchParams.get("action"); // payment canceled
  const apiKey = searchParams.get("apiKey");

  const { store } = useAuth();
  const { uid, user, raceEntry } = store.userStore;

  // the race entry form
  const [form, setForm] = useState<RaceEntry | null>(null);

  // UI state
  const [state, setState] = useState<REGISTER_STATE>(() => {
    if (action && user) return "EDIT";
    return "INIT";
  });

  console.log(
    `state is ${state} raceEntryState ${store.userStore.raceEntryState}`
  );

  if (state === "INIT") {
    // if no logined user yet, redirect user to login
    if (!store.authStore.isAuthenticated) {
      return (
        <div className="flex flex-w flex-wrap w-full justify-center gap-12">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Adult Race</h2>
              <p>Race for Adult</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    router.push("/login?continue=register&race=adult");
                  }}
                >
                  Register For Adult
                </button>
              </div>
            </div>
          </div>
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Kids Run</h2>
              <p>Race for kids under 18</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    router.push("/login?continue=register&race=kids");
                  }}
                >
                  Register For Kids Run
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // now user is logged in, race entry is either unpaid or paid
    // User already paid, user can either edit the info or proceed to create team/join team
    return (
      <div className="flex flex-col w-full justify-center items-center gap-8">
        <div>
          {success ? (
            <div>You success fully registered for race</div>
          ) : (
            <div>Manage your races</div>
          )}
        </div>
        <div className="card card-compact w-full bg-base-100 shadow-xl justify-center gap-8">
          {store.userStore.raceEntries ? (
            <DisplayRegistration
              raceEntries={store.userStore.raceEntries}
              setIndex={(index) => {
                store.userStore.setEditIndex(index);
                setState("EDIT");
              }}
              onPay={(index: number) => {
                store.userStore.setEditIndex(index);
                setForm(store.userStore.raceEntry);
                setState("FORM_SUBMITTED");
              }}
            />
          ) : (
            <div>Add your first Race</div>
          )}
        </div>
        <div className="flex w-full justify-end">
          <Button
            className="!btn-primary"
            onClick={() => {
              store.userStore.setEditIndex(null);
              setState("EDIT");
            }}
          >
            Add
          </Button>
        </div>
      </div>
    );
  }

  // user filled up the register form
  if (state === "FORM_SUBMITTED" && form) {
    const ConfirmPaymentPage = dynamic(() => import("./ConfirmPayment"), {
      ssr: false,
    });
    // form filled, then submit it to backend to get the checkout session Id
    const onSubmit = async () => {
      console.log(`Paying...`, { form });
      if (raceEntry?.isPaid) {
        store.userStore.updateRaceEntry(form);
        setForm(null);
        setState("INIT");
        return;
      }
      const [stripe, sessionId] = await Promise.all([
        stripePromise,
        store.userStore.submitRaceForm(form),
      ]);
      setForm(null);
      // redirect user to Stripe Checkout for payment
      if (stripe && sessionId) {
        stripe.redirectToCheckout({ sessionId: (sessionId as any).id });
      }
    };
    // user logged in and authStore has been fullfilled with user data
    return (
      <div className="flex flex-col justify-center pt-10">
        <ConfirmPaymentPage
          raceEntry={form}
          onSubmit={onSubmit}
          onCancel={() => {
            setState("EDIT");
          }}
        />
      </div>
    );
  }

  // Below is for state "EDIT"
  const RegisterForm = dynamic(() => import("./RegisterForm"), {
    ssr: false,
  });
  const raceInitEntry = {
    year: raceEntry?.year ?? store.event.year,
    uid: uid,
    email: raceEntry?.email ?? user?.email ?? "",
    firstName: raceEntry?.firstName ?? user?.firstName ?? "",
    lastName: raceEntry?.lastName ?? user?.lastName ?? "",
    preferName: raceEntry?.preferName ?? "",
    phone: raceEntry?.phone ?? user?.phone ?? "",
    gender: raceEntry?.gender ?? user?.gender ?? "",
    wechatId: raceEntry?.wechatId ?? user?.wechatId ?? "",
    birthYear: raceEntry?.birthYear ?? user?.birthYear ?? "",
    personalBest: raceEntry?.personalBest ?? user?.personalBest,
    race: raceEntry?.race ?? "",
    size: raceEntry?.size ?? "",
    emergencyName: raceEntry?.emergencyName ?? "",
    emergencyPhone: raceEntry?.emergencyPhone ?? "",
    isActive: raceEntry?.isActive ?? true,
    isPaid: raceEntry?.isPaid ?? false,
  };

  const onSubmit = (values) => {
    console.log(`Register Form data`, { values });
    const form = { ...values };
    setForm(form);
    setState("FORM_SUBMITTED");
  };
  const raceOptions = store.event.races.map((race) => ({
    value: race.name,
    label: race.description,
    entryFee: race.entryFee,
  }));
  // user logged in and authStore has been fullfilled with user data
  return (
    <div className="flex flex-col justify-center pt-10">
      <RegisterForm
        onSubmit={onSubmit}
        onCancel={() => {
          setState("INIT");
        }}
        onDelete={
          store.userStore.editIndex === null
            ? undefined
            : store.userStore.raceEntry?.isPaid
            ? undefined
            : () => {
                console.log(`Deleting index ${store.userStore.editIndex}`);
                store.userStore.deleteRaceEntry();
              }
        }
        raceEntry={raceInitEntry}
        raceOptions={raceOptions}
      />
    </div>
  );
}

export default observer(Page);
