import ProfileForm from "./ProfileForm";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";

const ProtectedPage = async () => {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Account Settings"
        text="Manage your account and settings."
      ></DashboardHeader>
      <div className="grid gap-10">
        <ProfileForm />
      </div>
    </DashboardShell>
  );
};

export default ProtectedPage;
