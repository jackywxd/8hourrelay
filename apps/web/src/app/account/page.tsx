"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@material-tailwind/react";
import { profileStore } from "./ProfileStore";

const ProtectedPage: React.FC = () => {
  const router = useRouter();
  const { store } = useAuth();

  const user = store.userStore.user;
  const raceEntry = store.userStore.raceEntry;

  console.log(`profileStore PAGE selected`, {
    selected: profileStore.selectedTab,
  });

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-fit justify-center items-center">
        <div>Current Login User</div>
        <div>Email: {user?.email}</div>
        <div>
          {raceEntry && (
            <div className="flex w-full m-10 justify-between items-center">
              <div>Registered raced: {raceEntry.raceId}</div>
              <Button
                className="!btn-secondary"
                onClick={() => {
                  router.push("/register?action=edit");
                }}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default observer(ProtectedPage);
