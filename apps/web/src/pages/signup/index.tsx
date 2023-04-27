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
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="mt-60 mb-30">Sign up</h1>
        <RegisterScreen
          onSignUp={onSignUp}
          onLogin={() => router.push("/login")}
        />
      </div>
    </div>
  );
}

export default Page;
