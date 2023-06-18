"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Login from "./Login";
import Loader from "@/components/Loader";

function LoginPage() {
  const router = useRouter();
  const {
    store: { authStore },
  } = useAuth();
  const searchParams = useSearchParams();

  const nextPath = searchParams.get("continue"); //continue to this route after login successfully
  const race = searchParams.get("race");
  const apiKey = searchParams.get("apiKey"); // apiKey from firebase

  const onSendLoginLink = async () => {
    const next = race ? `${nextPath}&race=${race}` : nextPath;
    await authStore.sendLoginEmailLink(next ?? "account");
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
        await authStore.signinWithEmailLink(fullUrl);
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
        router.push("/account");
      }
    }
  }, [authStore.isAuthenticated, nextPath, race]);

  return (
    <section>
      {authStore.state === "INIT" ? (
        <div className="flex flex-col min-h-full">
          <div className="flex text-center my-8 justify-center">
            <h2 className="text-left mb-10">
              {race
                ? `Please enter your email address and proceed to register for the race. As all communication by us will be via email, please ensure to enter a valid and working email address.`
                : `Please enter your email address. As all communication by us will be via email, please ensure to enter a valid and working email address.`}
            </h2>
          </div>
          <div>
            <Login
              initEmail={authStore.email}
              mode="login"
              onSubmit={(email: string) => {
                authStore.setEmail(email);
                authStore.setState("CONFIRM");
              }}
            />
          </div>
        </div>
      ) : authStore.state === "CONFIRM" ? (
        <div className="flex flex-col min-h-full">
          <div className="flex flex-col text-center my-8 justify-center">
            <h2 className="text-left mb-10">
              Please confirm your email address and click "Send" if it is
              correct. We will send you an email with URL to complete your
              login. This URL is only valid for one hour. Please check your
              email in time.
            </h2>
            <div className="text-xl">Email address: {authStore.email}</div>
          </div>

          <div className="flex flex-row w-full justify-between items-center">
            <button
              className="btn btn-secondary w-1/3"
              onClick={() => {
                authStore.setState("INIT");
              }}
            >
              back
            </button>
            <button className="btn btn-primary w-1/3" onClick={onSendLoginLink}>
              Send
            </button>
          </div>
        </div>
      ) : authStore.state === "EMAIL_LINK_SENT" ? (
        <div className="text-center">
          <h2>
            Check your email {authStore.email} and click the link in the email
            to login
          </h2>
        </div>
      ) : authStore.state === "MISSING_EMAIL" ? (
        <div className="text-center text-lg pt-10">
          <div className="text-center text-lg pt-10">
            Please confirm your email to login
          </div>
          <Login
            initEmail={authStore.email}
            mode="confirm"
            onSubmit={onLogin}
          />
        </div>
      ) : (
        <div className="flex items-end gap-8">{Loader}</div>
      )}
    </section>
  );
}

export default observer(LoginPage);
