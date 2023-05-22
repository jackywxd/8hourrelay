import { redirect } from "next/navigation";
import RegisterForm from "../RegisterForm";
import { Suspense } from "react";

function RegistrationPage({ params }) {
  if (!params.team) {
    redirect("/register");
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
