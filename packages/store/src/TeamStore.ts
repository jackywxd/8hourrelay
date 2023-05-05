import { Team } from "@8hourrelay/models";
import { computed } from "mobx";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Model, _async, model, tProp, types, modelFlow } from "mobx-keystone";
import { getApp } from "firebase/app";
import { RootStore } from "./RootStore";

@model("8HourRelay/TeamStore")
export class TeamStore extends Model({
  team: tProp(types.maybe(Team)).withSetter(),
  isLoading: tProp(types.boolean, () => false).withSetter(),
  error: tProp(types.string, () => "").withSetter(),
}) {
  @computed
  get db() {
    const app = getApp();
    const db = getFirestore(app);
    return db;
  }

  protected onAttachedToRootStore(rootStore: RootStore): void | (() => void) {
    console.log(`UserStore rootStore is ${rootStore}`);
  }

  @modelFlow
  getTeam = _async(function* (this: TeamStore, uid: string) {
    this.isLoading = true;
    try {
      console.log(`user data`);
      this.isLoading = false;
    } catch (error) {
      console.log(`failed to getUser`, error);
      this.setError((error as Error).message);
      this.isLoading = false;
    }
  });

  @modelFlow
  updateTeam = _async(function* (this: TeamStore, uid: string) {
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
      this.isLoading = false;
    }
  });
}
