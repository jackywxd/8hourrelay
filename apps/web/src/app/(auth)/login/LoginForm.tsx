"use client";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { UserAuthForm } from "@/components/user-auth-form";
import Logo from "@/components/icons/Logo";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Loader from "@/components/Loader";
import { useTheme } from "next-themes";

function LoginForm() {
  const { theme } = useTheme();
  const {
    store: { authStore },
  } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
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
      router.push("/account");
    }
  }, [authStore.isAuthenticated, nextPath, race]);

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      {authStore.state === "INIT" ? (
        <>
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto w-32 ">
              <Logo fill={theme === "light" ? `#000` : "#fff"} />
            </div>
            <div className="text-2xl font-semibold tracking-tight">
              Welcome!
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <UserAuthForm mode="login" />
        </>
      ) : authStore.state === "EMAIL_LINK_SENT" ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold">
            Check your email {authStore.email} and click the link in the email
            to login
          </h2>
        </div>
      ) : authStore.state === "MISSING_EMAIL" ? (
        <div className="text-center text-lg pt-10">
          <div className="text-center text-lg pt-10">
            Please confirm your email to login
          </div>
          <UserAuthForm mode="confirm" />
        </div>
      ) : (
        <div className="flex items-end gap-8">{Loader}</div>
      )}
    </div>
  );
}

export default observer(LoginForm);
