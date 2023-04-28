"use client";
import { useRouter } from "next/navigation";
import { LoginScreen } from "@8hourrelay/login";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const router = useRouter();
  const { store } = useAuth();
  const onLogin = async (email, password) => {
    const { result, error } = await store.authStore.login(email, password);

    if (error) {
      return console.log(error);
    }
    // else successful
    console.log(result);
    return router.push("/profile");
  };
  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="mt-60 mb-30">Sign In</h1>
        <LoginScreen onLogin={onLogin} onSignUp={() => router.push("signup")} />
      </div>
    </div>
  );
}

export default Page;
