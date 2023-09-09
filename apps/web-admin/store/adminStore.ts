import { RaceEntry, Team, User } from "@8hourrelay/models";
import {
  makeAutoObservable,
  reaction,
  IReactionDisposer,
  action,
  computed,
  toJS,
} from "mobx";

export type TeamData = Partial<Team> & {
  raceEntries: RaceEntry[];
};

export type UserData = Partial<User> & {
  raceEntries: RaceEntry[];
};

export class AdminStore {
  error: string | null = null;
  isLoading = false;

  teams: TeamData[] = [];
  raceEntries: RaceEntry[] = [];
  users: UserData[] = [];
  freeEntries: RaceEntry[] = [];
  messages?: string[] = [];

  // disposer: IReactionDisposer;
  //   teamDisposer: IReactionDisposer;

  constructor({
    teams,
    raceEntries,
    users,
    freeEntries,
  }: {
    teams: TeamData[];
    raceEntries: RaceEntry[];
    users: UserData[];
    freeEntries: RaceEntry[];
  }) {
    this.teams = teams;
    this.users = users;
    this.raceEntries = raceEntries ?? [];
    this.freeEntries = freeEntries ?? [];
    console.log("AdminStore initialized!!");
    makeAutoObservable(this);
  }

  setError(error: string | null) {
    this.error = error;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  reset() {
    this.error = null;
    this.isLoading = false;
  }

  initTeamData(teams: Team[], raceEntries: RaceEntry[]) {
    const teamDatas: TeamData[] = [];
    teams?.forEach((team) => {
      const teamData = { ...team, raceEntries: [] } as TeamData;
      const raceEntry = raceEntries?.filter((re) => re.teamId === team.id);
      if (raceEntry) teamData.raceEntries = raceEntry;
      if (team.teamMembers?.length !== raceEntry.length) {
        console.error("ERROR teamMembers is not eaqual to raceEntries");
      }
      teamDatas.push(teamData);
    });
    return teamDatas;
  }

  initUserData(users: User[], raceEntries: RaceEntry[]) {
    const teamDatas: UserData[] = [];
    users?.forEach((user) => {
      const userData = { ...user, raceEntries: [] } as TeamData;
      const raceEntry = raceEntries?.filter((re) => re.uid === user.uid);
      if (raceEntry) {
        userData.raceEntries = raceEntry;
      }
      teamDatas.push(userData);
    });
    return teamDatas;
  }

  getUserRaceEntries(uid: string) {
    return this.raceEntries.filter((re) => re.uid === uid);
  }
}
