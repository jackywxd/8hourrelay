import { Instance, types } from "mobx-state-tree";

export interface IUser extends Instance<typeof User> {}

export const User = types
  .model("User", {
    uid: types.identifier,
    name: types.string,
    email: types.string,
    phone: types.maybeNull(types.string),
    address: types.maybeNull(types.string),
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
