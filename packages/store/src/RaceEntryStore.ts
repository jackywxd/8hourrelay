import {
  Model,
  _async,
  clone,
  getRoot,
  model,
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
  raceEntry: tProp(types.maybe(types.model(RaceEntry))),
  event: tProp(types.maybe(types.model(Event))),
  isLoading: tProp(types.boolean, () => false).withSetter(),
  error: tProp(types.string, () => "").withSetter(),
  firstName: tProp(types.string, () => "").withSetter(),
  lastName: tProp(types.string, () => "").withSetter(),
  phone: tProp(types.string, () => "").withSetter(),
}) {
  protected onAttachedToRootStore(rootStore: RootStore): void | (() => void) {
    console.log(`RaceEntryForm attaching to root!!`);
    // clone data from rootStore when attached to root Store
    if (rootStore.userStore.user?.raceEntres) {
      const entries = rootStore.userStore.user?.raceEntres.filter(
        (r) => r.isActive
      );
      // user can only have one active race entry
      this.raceEntry = clone(entries[0]);
    } else if (rootStore.userStore.uid) {
      const raceEntry = new RaceEntry({
        uid: rootStore.userStore.uid,
        isActive: true,
      });
      this.raceEntry = raceEntry;
    }
    this.event = clone(rootStore.eventStore.event);

    const snapshot = onSnapshot(this, (newSnapshot) => {
      console.log(`Saving new form data`, { newSnapshot });
      const jsonData = JSON.stringify(newSnapshot);
      AsyncStorage.setItem(entryFormSnapshot, jsonData);
    });
    return () => snapshot();
  }
  @modelFlow
  submitForm = _async(function* (this: RaceEntryForm) {
    this.isLoading = true;
    // setup propery data base on the form data
    // const raceEntry = new RaceEntry({});
    try {
      // call API with raceEntry
      yield AsyncStorage.removeItem(entryFormSnapshot);
    } catch (error) {
      console.log(``, { error });
      this.error = (error as Error).message;
    }
    this.isLoading = false;
  });
}
