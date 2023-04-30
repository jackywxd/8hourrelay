import { types, SnapshotOut } from "mobx-state-tree";

export interface IRacer extends SnapshotOut<typeof Racer> {}

export const Racer = types.model("Racer", {
  uid: types.identifier,
  teamId: types.string,
  year: types.string,
  race: types.string, //
  // role: types.union(["admin"]),
  isAdmin: types.boolean, // whether is team admin
  paid: types.boolean,
  paymentId: types.string, // stripe payment Id
  bib: types.string, // bib number
});
