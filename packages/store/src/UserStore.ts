import { Instance, flow, getParent, getRoot, types } from "mobx-state-tree";
import { IUser, User } from "@8hourrelay/models";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore/lite";
import { RootStore } from "./RootStore";
import { FirebaseApp } from "firebase/app";

export const UserStore = types
  .model("UserStore", {
    identifier: types.optional(types.identifier, "UserStore"),
    user: types.maybeNull(User),
    isLoading: types.boolean,
    error: types.string,
  })
  .actions((self) => ({
    setUser: (user: IUser) => {
      self.user = User.create(user);
    },
    getUser: flow(function* (uid: string) {
      self.isLoading = true;
      try {
        const app = getRoot(self).firebaseApp as unknown as FirebaseApp;
        const db = getFirestore(app);
        const result = yield getDoc(doc(db, "Users", uid));
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
