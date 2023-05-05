"use client";
import { useRouter } from "next/navigation";
import { LoginWithEmailScreen } from "@8hourrelay/login";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "react-native-paper";

function Page() {
  const router = useRouter();
  let fullUrl;

  const {
    store: { authStore },
  } = useAuth();
  useEffect(() => {
    async function siginin() {
      if (typeof window !== "undefined") {
        // const fullURL = `${window.location.protocol}//${window.location.hostname}${asPath}`;
        fullUrl = window.location.href;
      }
      if (authStore.email && fullUrl) {
        await authStore.signinWithEmailLink(fullUrl);
        router.push("/siginin");
      }
    }
    siginin();
  }, []);

  return (
    <div className="flex flex-col  items-center h-screen">
      <div className="mt-20">
        <h1 className="mt-30 mb-30 font-bold text-2xl">Sign In</h1>
      </div>
      <div className="w-full md:max-w-[600px] h-full">
        {authStore.state === "INIT" && <div>Loading...</div>}
        {authStore.state === "VERFIED" && (
          <div>
            Welcome {authStore.email}!!
            <Button onPress={() => router.push("/profile")}>Profile</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(Page);
