"use client";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { profileStore } from "./ProfileStore";
import DisplayPage from "../register/RegisterPage";
import ProfileForm from "./ProfileForm";
import MyTeam from "./myteam/MyTeam";
import { Suspense } from "react";
import Loader from "@/components/Loader";

const ProtectedPage = () => {
  const { store } = useAuth();

  if (!store.authStore.isAuthenticated) return null;
  if (profileStore.active === 0)
    return (
      <Suspense fallback={Loader}>
        <ProfileForm />
      </Suspense>
    );
  if (profileStore.active === 1)
    return (
      <Suspense fallback={Loader}>
        <DisplayPage />
      </Suspense>
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
