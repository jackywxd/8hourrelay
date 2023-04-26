import { Instance, types } from "mobx-state-tree";

export interface IUser extends Instance<typeof User> {}

export const User = types
  .model("User", {
    uid: types.identifier,
    name: types.maybe(types.string),
    email: types.string,
    phone: types.maybe(types.string),
    address: types.maybe(types.string),
    emailVerified: types.boolean,
  })
  .actions((self) => ({
    setName(name: string) {
      self.name = name;
    },
    setEmailVerified(veried: boolean) {
      self.emailVerified = veried;
    },
  }));
