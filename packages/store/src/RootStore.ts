import { UserStore } from "./UserStore";
import { AuthStore } from "./AuthStore";
import { makeAutoObservable } from "mobx";
import { Race, Event } from "@8hourrelay/models";

export const appStatePersistenceKey = "appStatePersistenceKey";
export const entryFormSnapshot = "entryformsnapshot";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  event = new Event({
    name: `8HourRealy`,
    description: `2023 8 Hour Realy Race`,
    year: `2023`,
    location: "TBD",
    time: "Sep 10, 2023",
    isActive: true,
    createdAt: new Date().getTime(),
    races: [
      new Race("2023-8HourRealy-Adult", "Adult", "Adult Race", 30),
      new Race("2023-8HourRelya-Kids", "Kids", "Kids Run", 5),
    ],
  });
  constructor() {
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isLoading() {
    return this.userStore.isLoading || this.authStore.isLoading;
  }

  get error() {
    return this.userStore.error || this.authStore.error;
  }

  resetError() {
    this.userStore.setError("");
    this.authStore.setError("");
  }

  dispose() {
    this.userStore.dispose();
    this.authStore.dispose();
  }
}
