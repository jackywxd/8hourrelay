import { flow, getRoot, types } from "mobx-state-tree";
import { IUser, User } from "@8hourrelay/models";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore/lite";
import { FirebaseApp } from "firebase/app";

export const UserStore = types
  .model("UserStore", {
    identifier: types.optional(types.identifier, "UserStore"),
    user: types.maybeNull(User),
    isLoading: types.boolean,
    error: types.string,
  })
  .views((self) => ({
    get db() {
      const app = (getRoot(self) as any).firebaseApp;
      const db = getFirestore(app);
      return db;
    },
  }))
  .actions((self) => ({
    setUser: (user: IUser) => {
      self.user = User.create(user);
    },
    setEmailVerified: flow(function* () {
      if (!self.user) {
        throw new Error(`No current login user!!`);
      }
      if (self.user?.emailVerified) {
        throw new Error(`User email already verified!`);
      }
      try {
        yield setDoc(doc(self.db, "Users", self.user.uid), {
          emailVerified: true,
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
    getUser: flow(function* (uid: string) {
      self.isLoading = true;
      try {
        const result = yield getDoc(doc(self.db, "Users", uid));
        if (!result.exists()) {
          throw new Error(`No user data!`);
        }
        const data = result.data();
        console.log(`user data`, { user: data });
        self.isLoading = false;
      } catch (error) {
        console.log(`failed to getUser`, error);
        self.error = error.message;
        self.isLoading = false;
      }
    }),
  }));
