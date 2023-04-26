"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { RegisterScreen } from "@8hourrelay/login";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const handleForm = async (event) => {
    event.preventDefault();

    const { result, error } = await signUp(email, password);

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
        <RegisterScreen />
      </div>
    </div>
  );
}

export default Page;
