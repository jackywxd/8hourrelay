import {
  Model,
  _async,
  clone,
  fromSnapshot,
  getRoot,
  model,
  modelAction,
  modelFlow,
  onSnapshot,
  prop,
  rootRef,
  tProp,
  types,
} from "mobx-keystone";
import { Event, Race, RaceEntry, User } from "@8hourrelay/models";
import { RootStore, entryFormSnapshot } from "./RootStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailLink } from "firebase/auth";
import { AuthStore } from "./AuthStore";

// this is the form used by the client side
@model("8HourRelay/RaceentryForm")
export class RaceEntryForm extends Model({
  race: tProp(types.string, () => "").withSetter(),
  team: tProp(types.string, () => "").withSetter(),
  uid: tProp(types.string, () => "").withSetter(),
  email: tProp(types.string, () => "").withSetter(),
  firstName: tProp(types.string, () => "").withSetter(),
  lastName: tProp(types.string, () => "").withSetter(),
  phone: tProp(types.string, () => "").withSetter(),
  wechatId: tProp(types.string, () => "").withSetter(),
  gender: tProp(types.string, () => "").withSetter(),
  birthYear: tProp(types.string, () => "").withSetter(),
  size: tProp(types.string, () => "").withSetter(),
  personalBest: tProp(types.string, () => "").withSetter(),
  emergencyName: tProp(types.string, () => "").withSetter(),
  emergencyPhone: tProp(types.string, () => "").withSetter(),
}) {
  // only live in memory
  isLoading = false;
  error = "";
  event: Event | undefined;

  @modelAction
  setError(error: string) {
    this.error = error;
  }

  @modelAction
  initForm(rootStore: RootStore): void | (() => void) {
    console.log(`RaceEntryForm init form!!`);
    // clone data from rootStore when attached to root Store
    if (rootStore.userStore.user?.raceEntres) {
      const entries = rootStore.userStore.user?.raceEntres.filter(
        (r) => r.isActive
      );
      // user can only have one active race entry
      const entry = entries[0];
      if (entry) {
        this.size = entry.size ?? "";
        this.team = entry.team ?? "";
        this.race = entry.race ?? "";
        this.emergencyName = entry.emergencyName ?? "";
        this.emergencyPhone = entry.emergencyPhone ?? "";
      }
    } else if (rootStore.userStore.user) {
      const user = rootStore.userStore.user;
      if (user) {
        this.email = user.email;
        this.uid = user.uid;
        this.firstName = user.firstName ?? "";
        this.lastName == user.lastName ?? "";
        this.birthYear = user.birthYear ?? "";
        this.gender = user.gender ?? "";
        this.personalBest = user.personalBest ?? "";
      }
    }
    this.event = clone(rootStore.eventStore.event);
  }
  @modelFlow
  submitForm = _async(function* (this: RaceEntryForm, values: any) {
    this.isLoading = true;
    // setup propery data base on the form data
    // const raceEntry = new RaceEntry({});
    try {
      // call API with raceEntry
      const form = new RaceEntryForm(values);
      yield AsyncStorage.removeItem(entryFormSnapshot);
    } catch (error) {
      console.log(``, { error });
      this.error = (error as Error).message;
    }
    this.isLoading = false;
  });
}
