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
import { RegistrationStore } from "@8hourrelay/store/src";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export type REGISTER_STATE = "INIT" | "EDIT" | "FORM_SUBMITTED" | "DELETE";

function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const action = searchParams.get("action"); // payment canceled

  const { store } = useAuth();
  const registerStore = new RegistrationStore(store.userStore);

  const { uid, user, raceEntry } = store.userStore;

  // the race entry form
  const [form, setForm] = useState<RaceEntry | null>(null);

  // UI state
  const [state, setState] = useState<REGISTER_STATE>(() => {
    if (action && user) return "EDIT";
    return "INIT";
  });

  console.log(
    `state is ${state} raceEntryState ${store.userStore.raceEntryState} index ${store.userStore.editIndex}`
  );
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
    teamName: "",
    teamPassword: "",
    accepted: false,
  };

  const onSubmit = (values) => {
    console.log(`Register Form data`, { values });
    const form = { ...values };
    setForm(form);
    setState("FORM_SUBMITTED");
  };
  const onDelete =
    store.userStore.editIndex === null
      ? undefined
      : store.userStore.raceEntry?.isPaid
      ? undefined
      : async () => {
          console.log(`Deleting index ${store.userStore.editIndex}`);
          await store.userStore.deleteRaceEntry();
          router.refresh();
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
        onDelete={onDelete}
        raceEntry={raceInitEntry}
        raceOptions={raceOptions}
      />
    </div>
  );
}

export default observer(RegisterPage);
