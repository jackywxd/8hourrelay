"use client";
import { redirect, useRouter } from "next/navigation";
import RegisterForm from "../RegisterForm";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginFirst from "@/components/LoginFirst";

function RegistrationPage({ params }) {
  const { store } = useAuth();
  const router = useRouter();

  if (!params.team) {
    redirect("/register");
  }

  if (!store.authStore.isAuthenticated) {
    return <LoginFirst />;
  }

  const team = decodeURIComponent(params.team);
  // user logged in and authStore has been fullfilled with user data
  return (
    <div className="flex flex-col justify-center pt-10">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm team={team} />
      </Suspense>
    </div>
  );
}

export default RegistrationPage;
