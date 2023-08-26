import { redirect } from "next/navigation";
import RegisterPage from "../RegisterPage";
import { getTeam } from "@/firebase/serverApi";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Team } from "@8hourrelay/models";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CUT_OFF_DATE =
  process.env.NEXT_PUBLIC_CUT_OFF_DATE ?? "2023-08-31T23:59:59-07:00";

// accept incoming action and target in the url
// ops[0] = action (join, create, edit and etc)
// ops[1] = target (team name, user id and etc)
async function RegistrationPage({ params }) {
  console.log("Teams Action target", params.ops);
  // cutoff date
  const cutoffDate = new Date(CUT_OFF_DATE).getTime();

  if (new Date().getTime() > cutoffDate) {
    return (
      <div className="flex flex-col w-full h-full items-center mt-10">
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="close" className="text-red-500" />
          <EmptyPlaceholder.Title>
            Year 2023 registration is closed!
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
          <Link href="/">
            <Button className="w-full">Go Home Now</Button>
          </Link>
        </EmptyPlaceholder>
      </div>
    );
  }

  let action, team, raceId;
  if (params.ops) {
    action = params.ops[0];
    if (params.ops[1] && action === "join") {
      team = await getTeam(decodeURIComponent(params.ops[1]));
    }
    if (params.ops[1] && action === "edit") {
      raceId = params.ops[1];
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
      <RegisterPage team={team?.team} action={action} raceId={raceId} />
    </div>
  );
}

export default RegistrationPage;
