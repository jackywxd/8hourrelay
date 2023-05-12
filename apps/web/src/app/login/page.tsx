"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginWithEmailScreen } from "@8hourrelay/login";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Spinner } from "@material-tailwind/react";
import Login from "./Login";

function Page() {
  const router = useRouter();
  const {
    store: { authStore },
  } = useAuth();
  const searchParams = useSearchParams();

  const nextPath = searchParams.get("continue"); // payment succeed
  const race = searchParams.get("race"); // payment succeed
  const apiKey = searchParams.get("apiKey");

  console.log(`nextPath & race`, {
    nextPath,
    race,
    isAuthenticated: authStore.isAuthenticated,
  });
  const onSendLoginLink = async (email) => {
    const next = race ? `${nextPath}&race=${race}` : nextPath;
    await authStore.sendLoginEmailLink(email, next ?? "profile");
  };

  const onLogin = async (email) => {
    if (typeof window === "object") {
      const fullUrl = window.location.href;
      await authStore.signinWithEmailLink(fullUrl, email);
    }
  };

  // use click on login link will trigger below event
  useEffect(() => {
    async function siginin() {
      if (apiKey && typeof window !== "undefined") {
        const fullUrl = window.location.href;
        if (authStore.email && fullUrl) {
          await authStore.signinWithEmailLink(fullUrl);
        }
      }
    }
    siginin();
  }, [apiKey]);

  useEffect(() => {
    if (authStore.isAuthenticated) {
      if (nextPath && race) {
        router.push(`/register?race=${race}`);
      } else if (nextPath) {
        router.push(`/${nextPath}`);
      } else {
        router.push("/profile");
      }
    }
  }, [authStore.isAuthenticated, nextPath, race]);

  return (
    <div className="flex flex-col p-2 w-full md:max-w-[800px] min-h-full justify-center ">
      {authStore.state === "INIT" ? (
        <div className="flex flex-col min-h-full">
          <div className="flex text-center my-8 justify-center">
            <h1>
              {race
                ? `Log in using your email address and proceed to register for the race`
                : `Login in with your email`}
            </h1>
          </div>
          <Login mode="login" onSubmit={onSendLoginLink} />
        </div>
      ) : authStore.state === "EMAIL_LINK_SENT" ? (
        <div className="text-center">
          Check your email {authStore.email} and click the link to continue the
          register
        </div>
      ) : authStore.state === "MISSING_EMAIL" ? (
        <div className="text-center text-lg pt-10">
          <div className="text-center text-lg pt-10">
            Please provide your email for confirmation
          </div>
          <Login mode="confirm" onSubmit={onLogin} />
        </div>
      ) : (
        <div className="flex items-end gap-8">
          <Spinner className="h-12 w-12" />
        </div>
      )}
    </div>
  );
}

export default observer(Page);
