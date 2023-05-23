"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { RaceEntry, Team } from "@8hourrelay/models";

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

  if (!store.authStore.isAuthenticated) {
    return <div>Login in to view the data</div>;
  }

  if (
    store.userStore.user?.email &&
    !membersData.some((f) => f.email === store.userStore?.user?.email)
  ) {
    return <div>You are not the member of this team</div>;
  }
  const team = new Team(teamData);
  const members = membersData?.map((m) => new RaceEntry(m));

  return (
    <div className="overflow-x-auto w-full">
      <div>
        <h1>Team: {team.displayName}</h1>
      </div>
      <div className="self-end">
        <Link className="link link-primary" href={`/register/${team.name}`}>
          JOIN
        </Link>
      </div>
      <div className="divider" />
      <div className="flex w-full justify-between">
        <h1>Race: {team.race}</h1>
        {team.slogan && <h2>{team.slogan}</h2>}
        <h1>Captain: {team.captainEmail}</h1>
      </div>

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
          {members.map(({ firstName: name, email }, index) => {
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
    </div>
  );
}

export default TeamMemberList;
