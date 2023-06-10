"use client";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { profileStore } from "./ProfileStore";
import DisplayPage from "../register/RegisterPage";
import ProfileForm from "./ProfileForm";
import MyTeam from "./MyTeam";
import { Suspense } from "react";
import Loader from "@/components/Loader";

const ProtectedPage = () => {
  const router = useRouter();
  const { store } = useAuth();

  const user = store.userStore.user;
  console.log(`my Team`, store.userStore.myTeam);
  if (!store.authStore.isAuthenticated) return null;
  if (profileStore.active === 0)
    return (
      <div className="flex flex-col w-full justify-center items-center">
        <Suspense fallback={Loader}>
          <ProfileForm />
        </Suspense>
      </div>
    );
  if (profileStore.active === 1)
    return (
      <div className="flex flex-col w-full min-h-full">
        <Suspense fallback={Loader}>
          <DisplayPage />
        </Suspense>
      </div>
    );
  if (profileStore.active === 2)
    return (
      <Suspense fallback={Loader}>
        <MyTeam />
      </Suspense>
    );
  return null;
};

export default observer(ProtectedPage);
