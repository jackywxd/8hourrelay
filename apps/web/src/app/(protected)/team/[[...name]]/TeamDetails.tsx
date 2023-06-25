"use client";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { RaceEntry, Team } from "@8hourrelay/models";
import LoginFirst from "@/components/LoginFirst";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const isMember =
    store.userStore.user?.email &&
    membersData &&
    membersData.some((f) => f.email === store.userStore?.user?.email);

  const team = new Team(teamData);
  const members = membersData?.map((m) => new RaceEntry(m));
  useEffect(() => {
    if (!store.authStore.isAuthenticated) {
      router.push("/login");
    }
  }, [store.authStore.isAuthenticated]);

  return (
    <div className="flex flex-col overflow-x-auto w-full items-center">
      <div>
        <h2>Team: {team.displayName}</h2>
      </div>
      {team.isOpen && (
        <div className="self-end">
          <Link
            className="link link-primary"
            href={`/register/join/${team.name}`}
          >
            <button className="btn btn-primary btn-large">JOIN</button>
          </Link>
        </div>
      )}

      <div className="divider" />
      <div className="flex w-full justify-between m-8">
        <h2>Race: {team.raceDisplayName}</h2>
        {team.slogan && <h2>{team.slogan}</h2>}
        <h2>Captain: {team.captainName}</h2>
      </div>
      {!membersData || membersData.length === 0 ? (
        <p>Team {team.name} has no team members yet</p>
      ) : (
        isMember && (
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
        )
      )}
    </div>
  );
}

export default observer(TeamMemberList);
