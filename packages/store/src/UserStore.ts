import { Team, User } from "@8hourrelay/models";
import {
  computed,
  makeAutoObservable,
  reaction,
  IReactionDisposer,
  action,
  flow,
} from "mobx";
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  collection,
  DocumentSnapshot,
} from "firebase/firestore";
import { getApp } from "firebase/app";
import { RaceEntry } from "@8hourrelay/models/src/RaceEntry";
import {
  HttpsCallableResult,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStore, entryFormSnapshot } from "./RootStore";

export class UserStore {
  root: RootStore;
  uid: string | null = null;
  user?: User;
  team?: Team;
  raceEntries?: RaceEntry[] | [];
  isLoading = false;
  error = "";
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
        setUid: action,
        setUser: action,
        setRaceEntries: action,
        setError: action,
      },
      { autoBind: true }
    );
  }

  setError(error: string) {
    this.error = error;
  }

  setUid(uid: string | null) {
    console.log(`setting uid to ${uid}`);
    this.uid = uid;
    this.addUserListner(uid!);
  }

  setUser(user: User) {
    this.user = user;
  }

  setRaceEntries(races: RaceEntry[]) {
    this.raceEntries = races;
  }

  get raceEntry() {
    console.log(
      `returnning raceEntry ${JSON.stringify(
        this.raceEntries?.filter((f) => f.isActive)?.[0]
      )}`
    );
    return this.raceEntries?.filter((f) => f.isActive)?.[0];
  }

  get db() {
    const app = getApp();
    const db = getFirestore(app);
    return db;
  }

  addUserListner(uid: string) {
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

  *submitRaceForm(raceEntry: RaceEntry) {
    const functions = getFunctions();
    const onCreateCheckout = httpsCallable(functions, "onCreateCheckout");

    this.isLoading = true;
    try {
      const result: HttpsCallableResult<{ id: string }> =
        yield onCreateCheckout(raceEntry);
      console.log(`submit result`, result);

      if (result) {
        yield AsyncStorage.removeItem(entryFormSnapshot);
        return result.data;
      }
    } catch (error) {
      console.log(``, { error });
      this.error = (error as Error).message;
    }
    this.isLoading = false;
  }

  *createTeam() {
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

  *getTeam() {
    this.isLoading = true;
    try {
      console.log(`user data`);
      this.team = [];
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
// export const UserStore = types
//   .model("UserStore", {
//     identifier: types.optional(types.identifier, "UserStore"),
//     user: types.maybeNull(User),
//     isLoading: types.boolean,
//     error: types.string,
//   })
//   .views(() => ({
//     get db() {
//       const app = getApp();
//       const db = getFirestore(app);
//       return db;
//     },
//   }))
//   .actions((self) => ({
//     setUser: (user: IUser) => {
//       self.user = User.create(user);
//     },
//     updateUser: flow(function* (update: Omit<IUser, "uid">) {
//       if (!self.user) {
//         throw new Error(`No current login user!!`);
//       }
//       if (self.user?.emailVerified) {
//         throw new Error(`User email already verified!`);
//       }
//       try {
//         yield setDoc(doc(self.db, "Users", self.user.uid), {
//           ...update,
//           updatedAt: new Date().getTime(),
//         });
//       } catch (error) {
//         console.log(error);
//         throw error;
//       }
//     }),
//     getUser: flow(function* (uid: string) {
//       self.isLoading = true;
//       try {
//         const result = yield getDoc(doc(self.db, "Users", uid));
//         if (!result.exists()) {
//           throw new Error(`No user data!`);
//         }
//         const data = result.data();
//         console.log(`user data`, { user: data });
//         self.isLoading = false;
//       } catch (error) {
//         console.log(`failed to getUser`, error);
//         self.error = error.message;
//         self.isLoading = false;
//       }
//     }),
//   }));
