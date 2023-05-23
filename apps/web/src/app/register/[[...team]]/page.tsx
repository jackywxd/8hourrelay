import RegisterPage from "../RegisterPage";
import { Suspense } from "react";

function RegistrationPage({ params }) {
  let team;
  if (params.team) {
    console.log("Teams Action target", params.team);
    team = decodeURIComponent(params.team[0]);
  }

  // user logged in and authStore has been fullfilled with user data
  return (
    <div className="flex flex-col justify-center pt-10">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterPage team={team} />
      </Suspense>
    </div>
  );
}

export default RegistrationPage;
