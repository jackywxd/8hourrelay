"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { RegisterScreen } from "@8hourrelay/login";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const router = useRouter();
  const {
    store: { authStore },
  } = useAuth();

  const onSignUp = async (email: string, password: string) => {
    const { result, error } = await authStore.signup(email, password);

    if (error) {
      return console.log(error);
    }

    // else successful
    console.log(result);
    return router.push("/admin");
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        <h1 className="mt-30 mb-30 font-bold text-2xl">Sign Up</h1>
      </div>
      <div className="w-screen">
        <RegisterScreen
          onSignUp={onSignUp}
          onLogin={() => router.push("/login")}
        />
      </div>
    </div>
  );
}

export default Page;
