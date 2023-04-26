import {
  types,
  onSnapshot,
  getSnapshot,
  Instance,
  flow,
} from "mobx-state-tree";
// import { RepoStore } from "./RepoStore";
import { UserStore } from "./UserStore";
import { AuthStore } from "./AuthStore";
import { NavigationStore } from "./NavigationStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const appStatePersistenceKey = "appStatePersistenceKey";

export interface IRootStore extends Instance<typeof RootStore> {}

export const RootStore = types
  .model("RootStore", {
    identifier: types.optional(types.identifier, "RootStore"),
    authStore: types.optional(AuthStore, () =>
      AuthStore.create({ isAuthenticated: false, isLoading: false })
    ),
    userStore: types.optional(UserStore, () =>
      UserStore.create({ isLoading: false })
    ),
    navigationStore: types.optional(NavigationStore, () =>
      NavigationStore.create({
        // userScreenParams: {},
      })
    ),
  })
  .views((self) => ({
    isLoading() {
      return self.authStore.isLoading || self.userStore.isLoading;
    },
  }))
  .actions((self) => ({
    init: flow(function* () {
      try {
        yield Promise.all([]);
      } catch (error) {
        console.log(error);
      }
    }),
    async save() {
      try {
        const transformedSnapshot = getSnapshot(self);
        const json = JSON.stringify(transformedSnapshot);

        await AsyncStorage.setItem(appStatePersistenceKey, json);
      } catch (err) {
        console.warn("unexpected error " + err);
      }
      return self;
    },
  }));
