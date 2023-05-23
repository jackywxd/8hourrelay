import { Suspense } from "react";
import RegisterPage from "./RegisterPage";

function RegistrationPage({ params }) {
  if (params.team) {
    // handle team
    const team = params.team;
    console.log("Teams Action target", team);
  }

  // user logged in and authStore has been fullfilled with user data
  return (
    <div className="flex flex-col justify-center pt-10">
      <div className="flex flex-w flex-wrap w-full justify-center gap-12">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Adult Race</h2>
            <p>Race for Adult</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Kids Run</h2>
            <p>Race for kids under 18</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterPage />
      </Suspense>
    </div>
  );
}

export default RegistrationPage;
