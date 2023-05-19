import { Team, User } from "@8hourrelay/models";
import { makeAutoObservable, reaction, IReactionDisposer, action } from "mobx";
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

export type RaceEntryState = "FORM_SUBMITTED" | "PAID" | "INVALID_FORM" | "WIP";

export class UserStore {
  root: RootStore;
  uid: string | null = null;
  user?: User;
  raceEntries: RaceEntry[] | [] = []; // race entriy array
  editIndex: number | null = null; // current edit race entry index
  isLoading = false;
  error = "";
  state = "";
  userListner: null | (() => void) = null;
  raceEntryListner: null | (() => void) = null;
  disposer: IReactionDisposer | null;

  constructor(root: RootStore) {
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

    makeAutoObservable(
      this,
      {
        root: false,
        db: false,
        disposer: false,
        userListner: false,
        raceEntryListner: false,
        setUid: action,
        setUser: action,
        setRaceEntries: action,
        setError: action,
      },
      { autoBind: true }
    );
  }

  setState(state: string) {
    this.state = state;
  }

  get raceEntryState(): RaceEntryState {
    if (this.raceEntry?.isPaid) return "PAID";
    if (this.raceEntry?.sessionId) return "FORM_SUBMITTED";
    return "WIP";
  }

  // return the current selected race entry
  get raceEntry() {
    if (
      this.raceEntries &&
      typeof this.editIndex === "number" &&
      this.raceEntries.length > 0
    )
      return this.raceEntries[this.editIndex];
    else {
      if (this.raceEntries.length > 0) {
        return this.raceEntries.filter((f) => f.isActive)[0];
      }
    }
    return null;
  }

  // whether current user is captain for current team
  get isCaptain() {
    if (this.user && this.user.teamYear) {
      const y = this.user.teamYear.split("-");
      const year = new Date().getFullYear().toString();
      if (y[0] === year && y[1] === "APPROVED") return true;
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

  setEditIndex(index: number | null) {
    this.editIndex = index;
  }

  get db() {
    const app = getApp();
    const db = getFirestore(app);
    return db;
  }

  setError(error: string) {
    this.error = error;
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

    this.getTeam(); // get team data for this user
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

  *updateRaceEntry(form: RaceEntry) {
    console.log(`Updating race entry to new data`, {
      form,
      index: this.editIndex,
    });
    this.isLoading = true;
    try {
      const data: any = {};
      Object.entries(form).forEach((e) => {
        if (e[1] && editableEntries.includes(e[0])) {
          data[e[0]] = e[1];
        }
      });
      console.log(`update race with data`, { data });
      if (this.uid && this.editIndex !== null) {
        const id = this.raceEntries[this.editIndex].id;
        yield setDoc(doc(this.db, "Users", this.uid, "RaceEntry", id), data, {
          merge: true,
        });
        yield AsyncStorage.removeItem(entryFormSnapshot);
        this.setEditIndex(null);
      } else {
        throw new Error(`Failed to update race entry! Missing uid and raceId`);
      }
      this.isLoading = false;
    } catch (error) {
      console.log(`failed to Update Race Entry`, error);
      this.error = (error as Error).message;
      this.isLoading = false;
    }
  }

  *deleteRaceEntry() {
    console.log(`delete race entry`);
    this.isLoading = true;
    try {
      if (this.editIndex === null || !this.raceEntries) {
        throw new Error(`No selected delete race entry`);
      }
      const id = this.raceEntries[this.editIndex].id;
      const index = this.editIndex;
      // const newEntry = this.raceEntries?.filter(f=>f.id!==id)
      this.setEditIndex(null);
      this.raceEntries.splice(index, 1);
      yield deleteDoc(doc(this.db, "Users", this.uid!, "RaceEntry", id));
      yield AsyncStorage.removeItem(entryFormSnapshot);
    } catch (error) {
      console.log(`failed to getUser`, error);
      this.error = (error as Error).message;
    }
    this.isLoading = false;
  }

  *onGetStripeSession(sessionId: string) {
    const functions = getFunctions();
    const onGetStripeSession = httpsCallable(functions, "onGetStripeSession");

    this.isLoading = true;
    try {
      const result: HttpsCallableResult<{ id: string }> =
        yield onGetStripeSession({ session_id: sessionId });
      console.log(`session result`, result);

      return result.data;
    } catch (error) {
      console.log(``, { error });
      this.error = (error as Error).message;
    }
    this.isLoading = false;
    return null;
  }

  *submitRaceForm(raceEntry: RaceEntry): unknown {
    const functions = getFunctions();
    const onCreateCheckout = httpsCallable(functions, "onCreateCheckout");

    this.isLoading = true;

    try {
      if (this.editIndex !== null) {
        raceEntry.id = this.raceEntries[this.editIndex].id;
      }
      const result: HttpsCallableResult<unknown> = yield onCreateCheckout(
        raceEntry
      );
      console.log(`submit result`, result);

      if (result) {
        yield AsyncStorage.removeItem(entryFormSnapshot);
        this.setEditIndex(null);
        return result.data;
      }
    } catch (error) {
      console.log(``, { error });
      this.error = (error as Error).message;
    }
    this.isLoading = false;
    return null;
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
        email: this.user.email.toLowerCase(),
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
