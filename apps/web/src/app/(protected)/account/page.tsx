import "@/styles/form.css";
import ProfileForm from "./ProfileForm";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { PostCreateButton } from "@/components/post-create-button";

const ProtectedPage = async () => {
  // user logged in and authStore has been fullfilled with user data
  // return (
  //   <div className="container flex flex-col flex-1 p-5 lg:mx-auto justify-center">
  //     <ProfileForm />
  //   </div>
  // );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Account Settings"
        text="Manage your account and settings."
      >
        <PostCreateButton />
      </DashboardHeader>
      <div className="grid gap-10">
        <ProfileForm />
      </div>
    </DashboardShell>
  );
};

export default ProtectedPage;
