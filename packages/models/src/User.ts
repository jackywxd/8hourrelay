import { types, model, Model, tProp, SnapshotOutOf } from "mobx-keystone";
import { computed } from "mobx";
import { RaceEntry } from "./RaceEntry";

export type IUser = Omit<SnapshotOutOf<User>, "raceEntres">;

@model("8HourRelay/User")
export class User extends Model({
  uid: tProp(types.string),
  email: tProp(types.string),
  emailVerified: tProp(types.boolean).withSetter(),
  createdAt: tProp(types.number, () => new Date().getTime()),
  updatedAt: tProp(types.number).withSetter(),
  firstName: tProp(types.maybe(types.string)).withSetter(),
  lastName: tProp(types.maybe(types.string)).withSetter(),
  gender: tProp(types.maybe(types.string)).withSetter(),
  wechatId: tProp(types.maybe(types.string)).withSetter(),
  birthYear: tProp(types.maybe(types.string)).withSetter(),
  personalBest: tProp(types.maybe(types.string)).withSetter(),
  photoUrl: tProp(types.maybe(types.string)).withSetter(),
  emergencyContact: tProp(
    types.maybe(
      types.object(() => ({
        name: types.string,
        phone: types.string,
      }))
    )
  ).withSetter(),
  customerId: tProp(types.maybe(types.string)).withSetter(), // stripe customer Id
  phone: tProp(types.maybe(types.string)).withSetter(),
  address: tProp(types.maybe(types.string)).withSetter(),
  raceEntres: tProp(types.maybe(types.array(types.model(RaceEntry)))), // race entries the user register User
}) {
  @computed
  get displayName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// export interface IUser extends SnapshotOut<typeof User> {}

// export const User = types
//   .model("User", {
//     uid: types.identifier,
//     email: types.string,
//     emailVerified: types.boolean,
//     createdAt: types.number,
//     updatedAt: types.number,
//     photoUrl: types.maybe(types.string),
//     displayName: types.maybe(types.string),
//     phone: types.maybe(types.string),
//     address: types.maybe(types.string),
//     customerId: types.maybe(types.string), // stripe customer Id
//   })
//   .actions((self) => ({
//     setEmailVerified(veried: boolean) {
//       self.emailVerified = veried;
//     },
//     setCustomerId(id: string) {
//       self.customerId = id;
//     },
//   }));
