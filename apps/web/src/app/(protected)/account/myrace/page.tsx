import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { RaceEntryCreateButton } from "@/components/race-create-button";
import RaceEntries from "./RaceEntries";

const ProtectedPage = async () => {
  return (
    <DashboardShell>
      <DashboardHeader heading="My Race Entry" text="Manage your race entries.">
        <RaceEntryCreateButton />
      </DashboardHeader>
      <div className="grid gap-10">
        <RaceEntries />
      </div>
    </DashboardShell>
  );
};

export default ProtectedPage;
