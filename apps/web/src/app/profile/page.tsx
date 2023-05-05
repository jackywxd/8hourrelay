"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "ui";

const ProtectedPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    store: { authStore, userStore },
  } = useAuth();

  const user = userStore.user;
  const apiKey = searchParams.get("apiKey");

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
    if (!apiKey && !authStore.currentUser) {
      router.push("/login");
    }
  }, [apiKey, authStore.currentUser]);

  if (!user) {
    return null;
  }
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-fit justify-center items-center">
        <div>Current Login User</div>
        <div>Email: {user.email}</div>
        <h1>Click below to Enter 2023 8 Hour Relay Adule</h1>
        <div className="mt-11 mb-11">
          <Button
            onClick={() => {
              console.log(`loging out!`);
            }}
            text="Register Adult"
          />
        </div>
        <div className="text-zinc-900">
          <h1>Click below to Enter 2023 8 Hour Relay Adule</h1>
        </div>
        <div className="mt-11">
          <Button
            onClick={() => {
              console.log(`loging out!`);
            }}
            text="Register Kids"
          />
        </div>
        <div className="mt-11">
          <Button
            onClick={() => {
              console.log(`loging out!`);
              authStore.logout();
              router.push("/");
            }}
            text="Logout"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default observer(ProtectedPage);
