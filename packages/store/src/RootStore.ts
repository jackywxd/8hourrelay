import { UserStore } from "./UserStore";
import { AuthStore } from "./AuthStore";
import { makeAutoObservable } from "mobx";
import { event2023 } from "@8hourrelay/models";

export const appStatePersistenceKey = "appStatePersistenceKey";
export const entryFormSnapshot = "entryformsnapshot";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  event = event2023;
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
