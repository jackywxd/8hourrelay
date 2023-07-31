import { makeObservable, observable, action, computed, flow } from "mobx";
import { BaseStore } from "./UIBaseStore";
import { UserStore } from "./UserStore";
import { event2023, RaceEntry } from "@8hourrelay/models";
import { getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

import { getFunctions, httpsCallable } from "firebase/functions";

import { getApp } from "firebase/app";

export type TeamStoreState =
  | "INIT"
  | "RE_EDIT" // editing form
  | "EDIT" // editing form
  | "CONFIRM" // confirm form
  | "ERROR"
  | "SUCCESS";

export interface TeamForm {
  name: string;
  race: string;
  password: string;
  email: string; // captain email
  captainName: string; // captain name
  slogan?: string;
}

export class TeamStore extends BaseStore {
  userStore: UserStore | null = null;
  state: TeamStoreState = "INIT";
  form: TeamForm | null = null;
  teamValidated = false;
  constructor() {
    super();
    makeObservable(this, {
      state: observable,
      form: observable,
      raceDisplayName: computed,
      db: false,
      event: false,
      setForm: action,
      setState: action,
      setTeamValidated: action,
      createTeam: flow,
    });
  }

  get raceDisplayName() {
    if (this.form)
      return event2023.races.filter((r) => r.name === this.form?.race)[0]
        ?.description;
    return "";
  }

  setTeamValidated(status: boolean) {
    this.teamValidated = status;
  }

  attachedUserStore(userStore: UserStore) {
    this.userStore = userStore;
  }

  initialTeamForm(): TeamForm {
    if (this.form) return this.form;
    return {
      race: "",
      name: "",
      password: "",
      slogan: "",
      email: this.userStore?.user?.email ?? "",
      captainName: this.userStore?.user?.displayName ?? "",
    };
  }

  reset(): void {
    console.log(`reset state`);
    super.reset();
    this.form = null;
    this.state = "INIT";
  }

  setForm(form: TeamForm | null) {
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

  *createTeam() {
    const functions = getFunctions();
    const onCreateTeam = httpsCallable(functions, "onCreateTeam");
    const id = toast.loading(`Creating new team ...`);
    this.isLoading = true;
    try {
      const { name, race, password, slogan, captainName } = this.form!;
      console.log(`team data`, { name, race, password });
      const { data: result } = yield onCreateTeam({
        race, //kids run or Adult
        slogan,
        password,
        captainName,
        name: name.trim().toLowerCase(),
        email: this.userStore?.user?.email.toLowerCase(),
      });
      console.log(`create team result`, result);
      this.isLoading = false;
      if (!result.error) {
        this.setState("SUCCESS");
        toast.update(id, {
          render: `New team ${name} request submitted`,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        return;
      }
      this.setError(result.error);
    } catch (error) {
      console.log(`failed to create team!!`, error);
      this.setError((error as Error).message);
    }
    this.setState("ERROR");
    toast.update(id, {
      render: `Failed to submit new team request. Please try again later`,
      type: "error",
      isLoading: false,
      autoClose: 5000,
    });
    this.isLoading = false;
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
