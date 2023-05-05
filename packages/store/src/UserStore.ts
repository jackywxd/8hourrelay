import { User } from "@8hourrelay/models";
import { computed } from "mobx";
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import {
  Model,
  _async,
  model,
  tProp,
  types,
  modelFlow,
  modelAction,
  getRoot,
  onSnapshot as onMobxSnapshot,
} from "mobx-keystone";
import { getApp } from "firebase/app";
import { RaceEntry } from "@8hourrelay/models/src/RaceEntry";

@model("8HourRelay/UserStore")
export class UserStore extends Model({
  uid: tProp(types.maybe(types.string)).withSetter(),
  user: tProp(types.maybe(User)).withSetter(),
  isLoading: tProp(types.boolean, () => false).withSetter(),
  error: tProp(types.string, () => "").withSetter(),
}) {
  userListner: null | (() => void) = null;
  raceEntryListner: null | (() => void) = null;

  @computed
  get db() {
    const app = getApp();
    const db = getFirestore(app);
    return db;
  }

  onAttachedToRootStore() {
    console.log(`attaching userStore to root!`);
    const disposer = onMobxSnapshot(this, (newSnapshot, prev) => {
      console.log(`new userStore snapshot`, { newSnapshot, prev });
      if (newSnapshot.uid && newSnapshot.uid !== prev.uid) {
        this.addUserListner(newSnapshot.uid);
      }
    });
    return () => {
      disposer();
    };
  }

  @modelAction
  addUserListner(uid: string) {
    if (this.userListner) {
      this.userListner();
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
        if (!this.user) return;
        const raceEntries: RaceEntry[] = [];
        docSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`New Race Entry data`, data);
          const entry = new RaceEntry(data as RaceEntry);
          raceEntries.push(entry);
        });
        this.user.raceEntres = raceEntries;
      }
    );
  }

  @modelAction
  dispose() {
    this.userListner && this.userListner();
    this.raceEntryListner && this.raceEntryListner();
    this.user = undefined;
    this.userListner = null;
    this.raceEntryListner = null;
  }

  @modelFlow
  getUser = _async(function* (this: UserStore, uid: string) {
    this.isLoading = true;
    try {
      const result = yield getDoc(doc(this.db, "Users", uid));
      if (!result.exists()) {
        throw new Error(`No user data!`);
      }
      const data = result.data();
      console.log(`user data`, { user: data });
      this.isLoading = false;
    } catch (error) {
      console.log(`failed to getUser`, error);
      this.setError((error as Error).message);
      this.setIsLoading(false);
    }
  });
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
