"use client";
import { observer } from "mobx-react-lite";
import { useAuth } from "@/context/AuthContext";

import { RaceEntries } from "@/components/raceEntries";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { RaceEntryCreateButton } from "@/components/race-create-button";
import { Card, CardContent } from "@/components/ui/card";

function MyRacePage() {
  const { store } = useAuth();
  const raceEntries = store.userStore?.raceEntries.slice();

  console.log(`raceEntries`, { raceEntries });

  return (
    <>
      {raceEntries?.length ? (
        <Card>
          <CardContent>
            <RaceEntries raceEntries={raceEntries} />
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="trophy" />
          <EmptyPlaceholder.Title>No race entry</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any race entry yet.
          </EmptyPlaceholder.Description>
          <RaceEntryCreateButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </>
  );
}

export default observer(MyRacePage);
