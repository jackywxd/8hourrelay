import { types, SnapshotOut } from "mobx-state-tree";

export interface IUser extends SnapshotOut<typeof User> {}

export const User = types
  .model("User", {
    uid: types.identifier,
    email: types.string,
    emailVerified: types.boolean,
    createdAt: types.number,
    updatedAt: types.number,
    photoUrl: types.maybe(types.string),
    displayName: types.maybe(types.string),
    phone: types.maybe(types.string),
    address: types.maybe(types.string),
    customerId: types.maybe(types.string), // stripe customer Id
  })
  .actions((self) => ({
    setEmailVerified(veried: boolean) {
      self.emailVerified = veried;
    },
    setCustomerId(id: string) {
      self.customerId = id;
    },
  }));
