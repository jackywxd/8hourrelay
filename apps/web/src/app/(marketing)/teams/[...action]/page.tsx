import CreateTeam from "./CreateTeam";
import { redirect } from "next/navigation";
export default async function TeamPage({ params }: any) {
  const [action, target] = params.action;

  console.log("Teams Action target", action, target);

  if (!action) {
    redirect("/teams");
  }

  // we need to only show the same catagory teams for this race entry
  if (action === "create") {
    return (
      <div className="flex flex-col w-full min-h-fit items-center">
        {action === "create" && <CreateTeam />}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-fit items-center">
      {action === "create" && <CreateTeam />}
    </div>
  );
}
