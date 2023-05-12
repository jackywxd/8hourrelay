"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@material-tailwind/react";

const TeamPage: React.FC = () => {
  const router = useRouter();
  const { store } = useAuth();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");

  const [state, setState] = useState(() => {
    if (action === "create") {
      return "CREATE";
    }
    if (action === "join") {
      return "JOIN";
    }
    return "INIT";
  });

  const user = store.userStore.user;
  const raceEntry = store.userStore.raceEntry;

  console.log(`Action is ${action}`);

  if (state === "INIT") {
    // current user is not logged in yet
    if (!store.authStore.isAuthenticated) {
      return (
        <div className="flex flex-col w-1/2 min-h-fit justify-center items-center gap-3">
          <div>Team Page </div>
          <div>Please Register a Race Entry first</div>
          <Button
            fullWidth
            onClick={() => {
              router.push("/register");
            }}
          >
            register now
          </Button>
          <div>Already registered? Login now</div>
          <Button
            fullWidth
            onClick={() => {
              router.push("/login?continue=team");
            }}
          >
            Login now
          </Button>
        </div>
      );
    }

    // current user is logged in
    // already registered and paid
    if (!raceEntry || !raceEntry.isPaid) {
      return (
        <div className="flex flex-col w-full min-h-fit justify-center items-center gap-3">
          <div>Team Page </div>
          <div>Please complete current registration</div>
          <Button
            fullWidth
            onClick={() => {
              router.push("/register");
            }}
          >
            register
          </Button>
        </div>
      );
    }

    // current user is logged in
    // already registered and paid
    if (raceEntry.isPaid) {
      return (
        <div className="flex flex-col w-full min-h-fit justify-center items-center gap-3">
          <div>Team Page </div>
          <div>Please Select Action</div>
          <Button
            fullWidth
            onClick={() => {
              setState("CREATE");
            }}
          >
            Create a New Team
          </Button>
          <Button
            fullWidth
            onClick={() => {
              setState("JOIN");
            }}
          >
            Join Team
          </Button>
        </div>
      );
    }
    // user currently already has a team
    if (store.userStore.team) {
      if (store.userStore.isCaptain) {
        return (
          <div className="flex flex-col w-1/2 min-h-fit justify-center items-center gap-3">
            <div>Team Page</div>
            <div>Captain can manage team members</div>
            <Button
              fullWidth
              onClick={() => {
                router.push("/register");
              }}
            >
              Manage Team
            </Button>
          </div>
        );
      } else {
        // user is a team member
      }
    }
  }

  // below is state for EDIT
  if (state === "CREATE") {
    return <div>CREATE/EDIT TEAM</div>;
  }

  return <div>JOIN a TEAM</div>;
};

export default observer(TeamPage);
