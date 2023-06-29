import { redirect } from "next/navigation";
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
    redirect("/account/myrace");
  }
  // user logged in and authStore has been fullfilled with user data
  return (
    <div className="pt-30">
      <RegisterPage team={team?.team} action={action} />
    </div>
  );
}

export default RegistrationPage;
