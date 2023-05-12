"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@material-tailwind/react";
const ProtectedPage: React.FC = () => {
  const router = useRouter();
  const { store } = useAuth();

  const user = store.userStore.user;
  const raceEntry = store.userStore.raceEntry;

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
        <div className="mt-11 gap-3">
          <Button
            className="!btn-primary btn-lg"
            onClick={() => {
              console.log(`loging out!`);
              router.push("/");
              store.authStore.logout();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default observer(ProtectedPage);
