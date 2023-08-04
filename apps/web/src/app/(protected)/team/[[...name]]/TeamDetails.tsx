"use client";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { RaceEntry, Team } from "@8hourrelay/models";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/header";
import { TeamJoinButton } from "@/components/team-join-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import RaceEntryItem from "./RaceEntryItem";

function TeamMemberList({
  teamData,
  membersData,
}: {
  teamData: Team;
  membersData: RaceEntry[];
}) {
  const { store } = useAuth();
  const router = useRouter();
  const team = new Team(teamData);
  const entries = store.userStore?.raceEntries.slice();
  // whether is current login user is the member of the selected team
  const isMember = () => {
    let member = false;
    if (entries?.length && team && team.teamMembers) {
      team.teamMembers.forEach((m) => {
        if (entries.map((e) => e.paymentId).some((f) => f === m)) member = true;
      });
    }
    return member;
  };

  console.log("isMember", isMember());
  const members = membersData?.map((m) => new RaceEntry(m));
  useEffect(() => {
    if (!store.authStore.isAuthenticated) {
      router.push("/login");
    }
  }, [store.authStore.isAuthenticated]);

  return (
    <>
      <DashboardHeader
        heading={team.displayName}
        text={`Race: ${team.raceDisplayName}`}
      >
        {/* <TeamJoinButton team={team} /> */}
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>
            {team.isOpen
              ? `${team.name} is open for registration`
              : `${team.name} is closed for registration`}
          </CardTitle>
          <CardTitle>Captain: {team.captainName}</CardTitle>
          <CardTitle>{team.slogan && `Slogan: ${team.slogan}`}</CardTitle>
          <CardTitle>
            {members?.length > 0 && `Total members: ${members.length}`}
          </CardTitle>
        </CardHeader>

        {!membersData || membersData.length === 0 ? (
          <EmptyPlaceholder>
            {/* <EmptyPlaceholder.Icon name="close" className="text-red-500" /> */}
            <EmptyPlaceholder.Title>
              {decodeURI(team.displayName)} has no member yet
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description></EmptyPlaceholder.Description>
            {team.isOpen && (
              <Link href={`/register/join/${team.name}`}>
                <Button variant="outline">Join Now</Button>
              </Link>
            )}
          </EmptyPlaceholder>
        ) : !isMember() ? (
          <EmptyPlaceholder>
            {/* <EmptyPlaceholder.Icon name="close" className="text-red-500" /> */}
            <EmptyPlaceholder.Title>
              You are not member of team {decodeURI(team.displayName)}
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Only team member can veiw the details of the team.
            </EmptyPlaceholder.Description>
            <Link href={`/register/join/${team.name}`}>
              <Button variant="outline">Join Now</Button>
            </Link>
          </EmptyPlaceholder>
        ) : (
          <CardContent className="border-t pt-3">
            <div className="flex flex-col gap-3">
              {members.map((member) => {
                return <RaceEntryItem member={member} key={member.id} />;
              })}
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );
}

export default observer(TeamMemberList);
