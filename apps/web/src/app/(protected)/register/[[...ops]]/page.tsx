import { redirect } from "next/navigation";
import RegisterPage from "../RegisterPage";
import { getTeam } from "@/firebase/serverApi";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Team } from "@8hourrelay/models";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  console.log(`team data`, { team });
  if (action === "join" && team && team.team && !team?.team?.isOpen) {
    const teamInfo = new Team(team?.team);
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="users" className="text-red-500" />
        <EmptyPlaceholder.Title>
          {teamInfo.displayName} is not open for registration.
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          The captain may just close the registration. Please contact the
          captain or join another team.
        </EmptyPlaceholder.Description>
        <Link href="/team">
          <Button>See all teams</Button>
        </Link>
      </EmptyPlaceholder>
    );
  }

  return (
    <div className="pt-30">
      <RegisterPage team={team?.team} action={action} />
    </div>
  );
}

export default RegistrationPage;
