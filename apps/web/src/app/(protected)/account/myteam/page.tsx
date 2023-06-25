import MyTeam from "./MyTeam";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { TeamCreateButton } from "@/components/team-create-button";

const ProtectedPage = () => {
  return (
    <DashboardShell>
      <DashboardHeader heading="My Team" text="Manage your race team.">
        <TeamCreateButton />
      </DashboardHeader>

      <div className="grid gap-10">
        <MyTeam />
      </div>
    </DashboardShell>
  );
};

export default ProtectedPage;
