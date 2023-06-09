"use client";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { profileStore } from "./ProfileStore";
import DisplayPage from "../register/RegisterPage";
import ProfileForm from "./ProfileForm";

const ProtectedPage = () => {
  const router = useRouter();
  const { store } = useAuth();

  const user = store.userStore.user;

  if (!store.authStore.isAuthenticated) return null;
  if (profileStore.active === 0)
    return (
      <div className="flex flex-col w-full justify-center items-center">
        <ProfileForm />
      </div>
    );
  if (profileStore.active === 1)
    return (
      <div className="flex flex-col min-h-full">
        <DisplayPage />
      </div>
    );
  // if (profileStore.active === 2)
  //   return (
  //     <div className="flex flex-col min-h-fit justify-center items-center">
  //       <div>Team</div>
  //       <div></div>
  //     </div>
  //   );
  return null;
};

export default observer(ProtectedPage);
