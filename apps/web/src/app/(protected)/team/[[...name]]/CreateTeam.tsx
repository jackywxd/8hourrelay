"use client";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { teamStore } from "@8hourrelay/store/src/UIStore";
import CreateTeamForm from "./CreateTeamForm";
import ConfirmForm from "./ConfirmForm";
import Link from "next/link";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";

function CreateTeam() {
  const { store } = useAuth();
  teamStore.attachedUserStore(store.userStore);

  const router = useRouter();

  // if the current user is already a created a team, return null
  // one user can only create one team
  if (teamStore.state === "INIT" && store.userStore.pendingTeamRequest) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="close" className="text-red-500" />
        <EmptyPlaceholder.Title>
          You already created one team
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          One account can only create one team. If you want to create a new
          team, you can use another account.
        </EmptyPlaceholder.Description>
        <Link className="link open-button" href="/account/myteam">
          <Button variant="outline">OK</Button>
        </Link>
      </EmptyPlaceholder>
    );
  }

  if (teamStore.state === "INIT" || teamStore.state === "RE_EDIT") {
    return <CreateTeamForm />;
  }

  if (teamStore.state === "CONFIRM") {
    return <ConfirmForm />;
  }

  if (teamStore.state === "ERROR") {
    return (
      <>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="close" className="text-red-500" />
          <EmptyPlaceholder.Title>
            Failed to create team!
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Please double check your team name and make sure team name is not
            taken
          </EmptyPlaceholder.Description>
          <Button
            variant="outline"
            onClick={() => {
              teamStore.reset();
              router.push("/account/myteam");
            }}
          >
            OK
          </Button>
        </EmptyPlaceholder>
      </>
    );
  }
  if (teamStore.state === "SUCCESS") {
    return (
      <>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="check" className="text-green-500" />
          <EmptyPlaceholder.Title>Your team created!</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            New team request was submitted and pending for approval. We will
            notify you via email once it is approved. You will find your team's
            link in the email and share with your team members.
          </EmptyPlaceholder.Description>
          <Button
            onClick={() => {
              teamStore.reset();
              router.push("/account/myteam");
            }}
          >
            OK
          </Button>
        </EmptyPlaceholder>
      </>
    );
  }
  return null;
}

export default observer(CreateTeam);
