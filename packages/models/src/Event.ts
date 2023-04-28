import { types, SnapshotOut } from "mobx-state-tree";

export interface IEvent extends SnapshotOut<typeof Event> {}

export const Event = types.model("Event", {
  id: types.identifier,
  name: types.string,
  year: types.string,
  description: types.string,
  location: types.string,
  time: types.string,
  startedAt: types.string,
  expiredAt: types.string,
});
