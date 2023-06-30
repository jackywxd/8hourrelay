import { Team, User } from "@8hourrelay/models";
import {
  makeObservable,
  reaction,
  IReactionDisposer,
  action,
  computed,
  observable,
  flow,
} from "mobx";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
  DocumentSnapshot,
} from "firebase/firestore";
import { getApp } from "firebase/app";
import { RaceEntry, editableEntries } from "@8hourrelay/models/src/RaceEntry";
import {
  HttpsCallableResult,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import { RootStore, entryFormSnapshot } from "./RootStore";
import { BaseStore } from "./UIBaseStore";
import { toast } from "react-toastify";
import { validatePhoneNumber } from "./RegistrationStore";

export type RaceEntryState = "FORM_SUBMITTED" | "PAID" | "INVALID_FORM" | "WIP";

export class UserStore extends BaseStore {
  root: RootStore;
  uid: string | null = null;
  user?: User;
  raceEntries: RaceEntry[] | [] = []; // race entriy array
  myTeam: Team | null = null;
  state = "";
  userListner: null | (() => void) = null;
  raceEntryListner: null | (() => void) = null;
  disposer: IReactionDisposer;
  teamDisposer: IReactionDisposer;

  constructor(root: RootStore) {
    super();
    this.root = root;

    makeObservable(this, {
      uid: observable,
      user: observable,
      raceEntries: observable,
      state: observable,
      myTeam: observable,
      pendingTeamRequest: computed,
      teamId: computed,
      setUid: action,
      setUser: action,
      setRaceEntries: action,
      spliceRaceEntry: action,
      setState: action,
      getTeam: flow,
      getUser: flow,
      onUpdateTeam: flow,
      onUpdateUser: flow,
      addUserListner: action,
    });

    this.disposer = reaction(
      () => this.uid,
      (newUid) => {
        console.log(`reaction userStore snapshot`, { newUid });
        // if (!newUid) {
        //   this.dispose();
        // }
        if (newUid) {
          this.addUserListner(newUid);
        }
      }
    );
    this.teamDisposer = reaction(
      () => this.teamId,
      async (teamId) => {
        console.log(`reaction teamsId snapshot`, { teamId });
        await this.getTeam();
      }
    );
  }

  validateForm(form: RaceEntry) {
    let errors: any = {};

    if (form.birthYear) {
      const re = /^\d{4}$/;

      if (!re.test(form.birthYear)) {
        errors.birthYear = `Year of birth must be 4 digits`;
      }
    }
    console.log(`formvalidate errors`, { errors });
    if (form.phone && !validatePhoneNumber(form.phone)) {
      errors.phone = `Invalid phone number`;
    }
    return errors;
  }

  setState(state: string) {
    this.state = state;
  }

  spliceRaceEntry(index: number) {
    this.raceEntries.splice(index, 1);
  }

  // whether current user is captain for current team
  isCaptain(teamId: string) {
    return this.teamId === teamId ? true : false;
  }

  // captain's teamId
  // teamYear = "2023-APPROVED-{teamId}"
  get teamId() {
    if (this.user && this.user.teamYear) {
      const y = this.user.teamYear.split("-");
      if (y.length !== 3) {
        return null;
      }
      const year = new Date().getFullYear().toString();
      if (y[0] === year && y[1] === "APPROVED" && y[2]) {
        console.log(`computed teamId`, y[2]);
        return y[2];
      }
    }
    return null;
  }

  get pendingTeamRequest() {
    if (this.user && this.user.teamYear) {
      const y = this.user.teamYear.split("-");
      const year = new Date().getFullYear().toString();
      if (y[0] === year) return true;
    }
    return false;
  }

  get db() {
    const app = getApp();
    const db = getFirestore(app);
    return db;
  }

  setUid(uid: string | null) {
    if (this.uid === uid) return;
    console.log(`setting uid to ${uid} ${this.uid}`);
    this.root.authStore.setState("DONE");
    this.uid = uid;
  }

  setUser(user: User) {
    this.user = user;
  }

  setRaceEntries(races: RaceEntry[]) {
    this.raceEntries = races;
  }

  addUserListner(uid: string) {
    console.log(`adding user listner ${uid}`);
    if (!uid) {
      return;
    }
    // remove current user listner first
    if (this.userListner) {
      this.userListner();
    }
    // remove current race entry listner first
    if (this.raceEntryListner) {
      this.raceEntryListner();
    }
    this.userListner = onSnapshot(doc(this.db, "Users", uid), (doc) => {
      const user = doc.data() as User;
      console.log(`New User data`, user);
      this.setUser(new User(user));
    });
    this.raceEntryListner = onSnapshot(
      collection(this.db, "Users", uid, "RaceEntry"),
      (docSnapshot) => {
        if (docSnapshot.empty) return;
        const raceEntries: RaceEntry[] = [];
        docSnapshot.forEach(async (doc) => {
          const data = doc.data();
          console.log(`New Race Entry data`, data);
          const entry = new RaceEntry(data as RaceEntry);
          entry.id = doc.id; // race entry's ID
          // teamId updated, we need to get the team Info
          raceEntries.push(entry);
        });
        this.setRaceEntries(raceEntries);
      }
    );
  }

  dispose() {
    console.log(`dispose userstore`);
    if (!this.uid) return;
    super.reset();
    this.setUid(null);
    this.userListner && this.userListner();
    this.raceEntryListner && this.raceEntryListner();
    this.user = undefined;
    this.raceEntries = [];
    this.userListner = null;
    this.raceEntryListner = null;
    // this.disposer();
    // this.teamDisposer();
  }

  *getUser(uid: string) {
    this.isLoading = true;
    try {
      const result: DocumentSnapshot<User> = yield getDoc(
        doc(this.db, "Users", uid)
      );
      if (!result.exists()) {
        throw new Error(`No user data!`);
      }
      const data = result.data();
      console.log(`user data`, { user: data });
      this.isLoading = false;
    } catch (error) {
      console.log(`failed to getUser`, error);
      this.error = (error as Error).message;
    }
    this.isLoading = false;
  }

  *getTeam() {
    if (!this.teamId) return;
    const functions = getFunctions();
    const onGetTeam = httpsCallable(functions, "onGetTeam");

    this.isLoading = true;
    try {
      const result: HttpsCallableResult<Team> = yield onGetTeam({
        teamId: this.teamId,
      });
      console.log(`team data`, { result });
      if (!result) {
        throw new Error(`No team data!`);
      }
      console.log(`team result data`, { result: result.data });
      this.isLoading = false;
      this.myTeam = new Team(result.data);
      return result.data;
    } catch (error) {
      console.log(`failed to getTeam`, error);
      this.error = (error as Error).message;
    }
    this.isLoading = false;
  }

  *onUpdateTeam(newTeam: Partial<Team>) {
    if (this.isLoading) return;
    const functions = getFunctions();
    const onUpdateTeam = httpsCallable(functions, "onUpdateTeam");

    const id = toast.loading(`Updating team settings...`);
    this.isLoading = true;
    try {
      const result: HttpsCallableResult<Team[]> = yield onUpdateTeam({
        ...newTeam,
        id: this.teamId,
      });

      console.log(`update team result`, result.data);
      yield this.getTeam();
      this.isLoading = false;
      toast.update(id, {
        render: `Team settings updated`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
      console.log(`Failed to list teams`, { error });
      toast.update(id, {
        render: `Failed to update team settings. Please try again later.`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
    this.isLoading = false;
  }

  *onUpdateUser(form: Partial<User>) {
    console.log(`updating user form`, form);
    const id = toast.loading(`Updating account settings...`);
    this.isLoading = true;
    try {
      yield setDoc(doc(this.db!, "Users", this.uid!), form, {
        merge: true,
      });
      this.isLoading = false;
      toast.update(id, {
        render: `Account settings updated`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
      console.log(`Failed to list teams`, { error });
      toast.update(id, {
        render: `Failed to update account settings. Please try again later.`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
    this.isLoading = false;
  }
}
