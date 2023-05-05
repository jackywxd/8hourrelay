import { Racer, User } from "@8hourrelay/models";
import { computed } from "mobx";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import {
  Model,
  _async,
  model,
  tProp,
  types,
  modelFlow,
  modelAction,
} from "mobx-keystone";

import axios from "axios";
import { getApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { RootStore } from "./RootStore";
import { fetchPostJSON } from "./utils/api-helpers";

axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

// UI store to manage the race register
@model("8HourRelay/RegisterStore")
export class RegisterStore extends Model({
  email: tProp(types.maybe(types.string)).withSetter(),
  race: tProp(types.maybe(types.string), () => "Adult").withSetter(),
  isLoading: tProp(types.boolean, () => false).withSetter(),
  error: tProp(types.string, () => "").withSetter(),
}) {
  racerListner: null | (() => void) = null;
  @computed
  get db() {
    const app = getApp();
    const db = getFirestore(app);
    return db;
  }

  @computed
  get functions() {
    const app = getApp();
    const functions = getFunctions(app);
    return functions;
  }

  protected onAttachedToRootStore(rootStore: RootStore): void | (() => void) {
    console.log(`RacerStore rootStore is ${rootStore}`);
  }

  @modelAction
  addUserListner(uid: string) {
    this.racerListner = onSnapshot(doc(this.db, "Racers", uid), (doc) => {
      const user = doc.data() as Racer;
      console.log(`New User data`, user);
    });
  }

  @modelAction
  dispose() {
    if (this.racerListner) {
      this.racerListner();
      this.racerListner = null;
    }
  }
  @modelFlow
  createCheckOutSession = _async(function* (this: RegisterStore) {
    console.log(`Calling create check out session`);
    if (this.isLoading) {
      return;
    }
    const api = `https://us-central1-hourrelay-dev.cloudfunctions.net/onCreateCheckout`;
    this.isLoading = true;
    try {
      let response;
      if (!this.email) {
        throw new Error(`Missing email`);
      }
      if (!this.race) {
        throw new Error(`Missing race`);
      }
      response = yield axios.post(api, {
        email: this.email,
        race: this.race,
      });
      console.log(`create checkout response`, { response });
      this.isLoading = false;
      return response.data;
    } catch (error) {
      console.log(`failed to createCheckOut`, error);
      this.error = (error as Error).message;
      this.setIsLoading(false);
    }
    return null;
  });
  @modelFlow
  getStripeSession = _async(function* (this: RegisterStore, sessionId: string) {
    console.log(`Calling get Stripe session`);
    if (this.isLoading) {
      return;
    }
    const api = `https://us-central1-hourrelay-dev.cloudfunctions.net/onGetStripeSession`;
    this.isLoading = true;
    try {
      const response = yield axios.post(api, {
        session_id: sessionId,
      });
      console.log(`Session Id is`, { response });
      this.isLoading = false;
      this.setEmail(response.data.email);
      return response.data;
    } catch (error) {
      console.log(`failed to createCheckOut`, error);
      this.error = (error as Error).message;
      this.setIsLoading(false);
    }
    return null;
  });
  @modelFlow
  createCheckOutSession1 = _async(function* (this: RegisterStore) {
    console.log(`Calling create check out session`);
    const api = `https://us-central1-hourrelay-dev.cloudfunctions.net/onCreateCheckout`;
    this.isLoading = true;
    try {
      if (!this.email) {
        throw new Error(`Missing email`);
      }
      if (!this.race) {
        throw new Error(`Missing race`);
      }
      let response;
      response = yield fetchPostJSON(api, {
        race: this.race,
        email: this.email,
      });
      console.log(`create checkout response`, { response });
      this.isLoading = false;
      return response;
    } catch (error) {
      console.log(`failed to createCheckOut`, error);
      this.error = (error as Error).message;
      this.setIsLoading(false);
    }
    return null;
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
