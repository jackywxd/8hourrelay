"use client";
import { observer } from "mobx-react-lite";
import { useAuth } from "@/context/AuthContext";

import TeamForm from "./TeamForm";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { TeamCreateButton } from "@/components/team-create-button";

function MyTeam() {
  const { store } = useAuth();
  const team = store.userStore.myTeam;
  return (
    <>
      {team ? (
        <TeamForm />
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="users" />
          <EmptyPlaceholder.Title>
            You don't have any team yet
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Create your team and invite your friends to join.
          </EmptyPlaceholder.Description>
          <TeamCreateButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </>
  );
}

export default observer(MyTeam);
