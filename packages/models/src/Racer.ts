import { types, SnapshotOut } from "mobx-state-tree";

export interface IRacer extends SnapshotOut<typeof Racer> {}

export const Racer = types.model("Racer", {
  uid: types.identifier,
  teamId: types.string,
  race: types.string, //
  // role: types.union(["admin"]),
  isAdmin: types.boolean, // whether is team admin
  paid: types.boolean,
  payment: types.string,
  bib: types.string, // bib number
});
