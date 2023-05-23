import { Team, User } from "@8hourrelay/models";
import {
  makeObservable,
  reaction,
  IReactionDisposer,
  action,
  observable,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStore, entryFormSnapshot } from "./RootStore";
import { BaseStore } from "./UIBaseStore";

export type RaceEntryState = "FORM_SUBMITTED" | "PAID" | "INVALID_FORM" | "WIP";

export class UserStore extends BaseStore {
  root: RootStore;
  uid: string | null = null;
  user?: User;
  raceEntries: RaceEntry[] | [] = []; // race entriy array
  state = "";
  userListner: null | (() => void) = null;
  raceEntryListner: null | (() => void) = null;
  disposer: IReactionDisposer | null;

  constructor(root: RootStore) {
    super();
    this.root = root;
    this.disposer = reaction(
      () => this.uid,
      (newUid, prev) => {
        console.log(`new userStore snapshot`, { newUid, prev });
        if (!newUid) {
          this.dispose();
        }
        if (newUid) {
          this.addUserListner(newUid);
        }
      }
    );

    makeObservable(this, {
      uid: observable,
      user: observable,
      raceEntries: observable,
      state: observable,
      root: false,
      db: false,
      disposer: false,
      userListner: false,
      raceEntryListner: false,
      setUid: action,
      setUser: action,
      setRaceEntries: action,
    });
  }

  setState(state: string) {
    this.state = state;
  }

  spliceRaceEntry(index: number) {
    this.raceEntries.splice(index, 1);
  }

  // whether current user is captain for current team
  isCaptain(teamId: string) {
    if (this.user && this.user.teamYear) {
      const y = this.user.teamYear.split("-");
      if (y.length !== 3) {
        return false;
      }
      const year = new Date().getFullYear().toString();
      if (y[0] === year && y[1] === "APPROVED" && y[2] === teamId) return true;
    }
    return false;
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
    console.log(`setting uid to ${uid}`);
    this.uid = uid;
    if (uid) this.addUserListner(uid);
  }

  setUser(user: User) {
    this.user = user;
  }

  setRaceEntries(races: RaceEntry[]) {
    this.raceEntries = races;
  }

  addUserListner(uid: string) {
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
        docSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`New Race Entry data`, data);
          const entry = new RaceEntry(data as RaceEntry);
          entry.id = doc.id; // race entry's ID
          raceEntries.push(entry);
        });
        this.setRaceEntries(raceEntries);
      }
    );
  }

  dispose() {
    super.reset();
    this.setUid(null);
    this.userListner && this.userListner();
    this.raceEntryListner && this.raceEntryListner();
    this.user = undefined;
    this.raceEntries = [];
    this.userListner = null;
    this.raceEntryListner = null;
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
      this.isLoading = false;
    }
  }
}
