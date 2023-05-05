import { UserStore } from "./UserStore";
import { AuthStore } from "./AuthStore";
import { computed } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Model,
  model,
  prop,
  onSnapshot,
  applySnapshot,
  fromSnapshot,
  modelAction,
} from "mobx-keystone";
import { EventStore } from "./EventStore";
import { TeamStore } from "./TeamStore";
import { RaceEntryForm } from "./RaceEntryStore";
import { RaceEntry } from "@8hourrelay/models";

export const appStatePersistenceKey = "appStatePersistenceKey";
export const entryFormSnapshot = "entryformsnapshot";

@model("8HourRelay/root")
export class RootStore extends Model({
  authStore: prop<AuthStore>(() => new AuthStore({})),
  userStore: prop<UserStore>(() => new UserStore({})),
  eventStore: prop<EventStore>(() => new EventStore({})),
  teamStore: prop<TeamStore>(() => new TeamStore({})),
  entryForm: prop<RaceEntryForm | undefined>().withSetter(),
}) {
  @computed
  get isLoading() {
    return this.userStore.isLoading || this.authStore.isLoading;
  }

  get error() {
    return this.userStore.error || this.authStore.error;
  }

  protected onInit(): void {
    if (typeof window === "object")
      AsyncStorage.getItem(entryFormSnapshot).then((data) => {
        console.log(`${entryFormSnapshot} snapshot is ${data}`);
        if (data) {
          const parsedData = JSON.parse(data);
          console.log(`Parsed Data is`, { parsedData });
          const form = fromSnapshot(RaceEntryForm, parsedData);
          this.setEntryForm(form);
        }
      });
  }

  resetError() {
    this.userStore.setError("");
    this.authStore.setError("");
  }

  dispose() {
    this.userStore.dispose();
  }
}
