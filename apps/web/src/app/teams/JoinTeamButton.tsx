"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const JoinTeamButton = ({ name }) => {
  const { store } = useAuth();
  const router = useRouter();

  return (
    <button
      className="btn !btn-primary btn-xs"
      onClick={() => {
        router.push(`/team/${name}/add`);
      }}
    >
      {store.userStore.isCaptain ? `Add Member` : `Join`}
    </button>
  );
};
