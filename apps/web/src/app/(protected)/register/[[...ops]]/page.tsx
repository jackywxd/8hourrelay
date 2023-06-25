import RegisterPage from "../RegisterPage";
import { getTeam } from "@/firebase/serverApi";

async function RegistrationPage({ params }) {
  console.log("Teams Action target", params.ops);
  let action, team;
  if (params.ops) {
    action = params.ops[0];
    if (params.ops[1]) {
      team = await getTeam(decodeURIComponent(params.ops[1]));
    }
  }

  if (action === "join" && !team) {
    return (
      <div className="pt-10">
        <div>Cannot join this team</div>
      </div>
    );
  }
  // user logged in and authStore has been fullfilled with user data
  return (
    <div className="container content-container">
      <RegisterPage team={team?.team} action={action} />
    </div>
  );
}

export default RegistrationPage;
