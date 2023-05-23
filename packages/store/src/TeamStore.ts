import { makeObservable, observable, action, computed, flow } from "mobx";
import { BaseStore } from "./UIBaseStore";
import { UserStore } from "./UserStore";
import { RaceEntry } from "@8hourrelay/models";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDoc, doc, deleteDoc, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

import {
  getFunctions,
  httpsCallable,
  HttpsCallableResult,
} from "firebase/functions";
import { Race, Event } from "@8hourrelay/models";

import { entryFormSnapshot } from "./RootStore";
import { getApp } from "firebase/app";

export type TeamStoreState =
  | "INIT"
  | "SHOW" // show a form
  | "EDIT" // editing form
  | "CONFIRM" // confirm form
  | "FORM_SUBMITTED" //form submitted
  | "ERROR"
  | "SUCCESS";

// entries user can update after register payment
export const editableEntries = [
  "firstName",
  "lastName",
  "preferName",
  "personalBest",
  "email", // for other people's entry
  "phone",
  "gender",
  "size",
  "team",
  "emergencyName",
  "emergencyPhone",
];

export class TeamStore extends BaseStore {
  userStore: UserStore | null = null;
  state: TeamStoreState = "INIT";
  form: RaceEntry | null = null;
  teamValidated = false;
  event = new Event({
    name: `8HourRealy`,
    description: `2023 8 Hour Realy Race`,
    year: `2023`,
    location: "TBD",
    time: "Sep 10, 2023",
    isActive: true,
    createdAt: new Date().getTime(),
    races: [
      new Race("2023", "Adult", "TBD", "Adult Race", 30),
      new Race("2023", "Kids", "TBD", "Kids Run", 5),
    ],
  });
  constructor() {
    super();
    makeObservable(this, {
      state: observable,
      form: observable,
      db: false,
      event: false,
      setForm: action,
      setState: action,
      setTeamValidated: action,
      createTeam: flow,
      joinTeam: flow,
      updateTeam: flow,
      getTeam: flow,
      listAllTeam: flow,
    });
  }

  setTeamValidated(status: boolean) {
    this.teamValidated = status;
  }

  attachedUserStore(userStore: UserStore) {
    this.userStore = userStore;
  }

  reset(): void {
    super.reset();
    this.state = "INIT";
  }

  setForm(form: RaceEntry | null) {
    this.form = form ? form : null;
  }

  get db() {
    const app = getApp();
    const db = getFirestore(app);
    return db;
  }

  setState(state: TeamStoreState) {
    this.state = state;
  }

  *createTeam({
    name,
    race,
    slogon,
    password,
  }: {
    name: string;
    slogon: string;
    race: string;
    password: string;
  }) {
    const functions = getFunctions();
    const onCreateTeam = httpsCallable(functions, "onCreateTeam");

    this.isLoading = true;
    try {
      console.log(`team data`, { name, race, password });
      const { data: result } = yield onCreateTeam({
        race, //kids run or Adult
        slogon,
        password,
        name: name.toLowerCase(),
        email: this.userStore?.user?.email.toLowerCase(),
        captainName: this.userStore?.user?.displayName ?? "",
      });
      console.log(`create team result`, result);
      if (result.error) {
        this.setError(result.error);
      }

      this.isLoading = false;
    } catch (error) {
      console.log(`failed to create team!!`, error);
      this.setError((error as Error).message);
      this.isLoading = false;
    }
  }

  *joinTeam(raceEntryIds: string[], teamId: string, password: string) {
    const functions = getFunctions();
    const onJoinTeam = httpsCallable(functions, "onJoinTeam");

    this.isLoading = true;
    try {
      console.log(`team `, { raceEntryIds, teamId });
      const { data: result } = yield onJoinTeam({
        raceEntryIds,
        teamId,
        password,
      });
      console.log(`join team result`, result);
      if (result.error) {
        this.setError(result.error);
      }
      this.isLoading = false;
    } catch (error) {
      console.log(`failed to create team!!`, error);
      this.setError((error as Error).message);
      this.isLoading = false;
    }
  }

  *getTeam() {
    this.isLoading = true;
    try {
      console.log(`getting team data`);
      // this.team = [];
      this.isLoading = false;
      // query team data for this uer
    } catch (error) {
      console.log(`failed to getUser`, error);
      this.setError((error as Error).message);
      this.isLoading = false;
    }
  }

  *updateTeam() {
    this.isLoading = true;
    try {
      console.log(`user data`, { user: this });
      this.isLoading = false;
    } catch (error) {
      console.log(`failed to getUser`, error);
      this.setError((error as Error).message);
      this.isLoading = false;
    }
  }

  *listAllTeam() {
    this.isLoading = true;
    try {
      console.log(`user data`);
      this.isLoading = false;
    } catch (error) {
      console.log(`failed to getUser`, error);
      this.setError((error as Error).message);
      this.isLoading = false;
    }
  }
}
