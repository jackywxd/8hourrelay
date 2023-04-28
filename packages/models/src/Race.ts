import { types, SnapshotOut } from "mobx-state-tree";

export interface IRace extends SnapshotOut<typeof Race> {}

export const Race = types.model("Race", {
  uid: types.identifier,
  eventId: types.string,
  name: types.string, // adult race, teen
  description: types.string,
  entryFee: types.number,
  startedAt: types.string,
  expiredAt: types.string,
});
