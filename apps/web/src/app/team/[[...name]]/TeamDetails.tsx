"use client";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { RaceEntry, Team } from "@8hourrelay/models";
import LoginFirst from "@/components/LoginFirst";

const TABLE_HEAD = ["Name", "Email", ""];

// data passed from server side is plain object
function TeamMemberList({
  teamData,
  membersData,
}: {
  teamData: Team;
  membersData: RaceEntry[];
}) {
  const { store } = useAuth();

  if (
    store.userStore.user?.email &&
    membersData &&
    !membersData.some((f) => f.email === store.userStore?.user?.email)
  ) {
    return <div>You are not the member of this team</div>;
  }
  const team = new Team(teamData);
  const members = membersData?.map((m) => new RaceEntry(m));

  return (
    <div className="flex flex-col overflow-x-auto w-full items-center">
      <div>
        <h1>Team: {team.displayName}</h1>
      </div>
      <div className="self-end">
        <Link
          className="link link-primary"
          href={`/register/join/${team.name}`}
        >
          JOIN
        </Link>
      </div>
      <div className="divider" />
      <div className="flex w-full justify-between m-8">
        <h2>Race: {team.race}</h2>
        {team.slogan && <h2>{team.slogan}</h2>}
        <h2>Captain: {team.captainName}</h2>
      </div>
      {!membersData || membersData.length === 0 ? (
        <h1>Team {team.name} has no team members yet</h1>
      ) : (
        <>
          <div className="divider">Team Members</div>
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map(({ displayName: name, email }, index) => {
                return (
                  <tr key={`${name}-${index}`}>
                    <td>
                      <div>
                        <div className="font-bold">{name}</div>
                      </div>
                    </td>
                    <td>{email}</td>
                    <th className="flex gap-2"></th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default observer(TeamMemberList);
