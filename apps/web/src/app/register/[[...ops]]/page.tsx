import { Suspense } from "react";
import RegisterPage from "../RegisterPage";
import Loader from "@/components/Loader";

async function RegistrationPage({ params }) {
  console.log("Teams Action target", params.ops);
  let action, team;
  if (params.ops) {
    action = params.ops[0];
    team = params.ops[1] ? decodeURIComponent(params.ops[1]) : null;
  }

  // user logged in and authStore has been fullfilled with user data
  return (
    <div className="pt-10">
      <Suspense fallback={Loader}>
        <RegisterPage team={team} action={action} />
      </Suspense>
    </div>
  );
}

export default RegistrationPage;
