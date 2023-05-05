"use client";
import { useRouter } from "next/navigation";
import { LoginWithEmailScreen } from "@8hourrelay/login";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

function Page() {
  const router = useRouter();
  const {
    store: { authStore },
  } = useAuth();
  const onLogin = async (email) => {
    await authStore.sendLoginEmailLink(email, "profile");
  };
  useEffect(() => {
    if (authStore.currentUser) {
      router.push("/profile");
    }
  }, [authStore.currentUser]);

  return (
    <div className="flex flex-col  items-center h-screen">
      <div className="mt-20">
        <h1 className="mt-30 mb-30 font-bold text-2xl">Sign In</h1>
      </div>
      <div className="w-full md:max-w-[600px] h-full">
        {authStore.state === "INIT" && (
          <LoginWithEmailScreen onLogin={onLogin} />
        )}
        {authStore.state === "EMAIL_LINK_SENT" && (
          <div>
            Check your email {authStore.email} and click the link to login
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(Page);
