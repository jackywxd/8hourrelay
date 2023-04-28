import { types, SnapshotOut } from "mobx-state-tree";

export interface ITeam extends SnapshotOut<typeof Team> {}

export const Team = types.model("Team", {
  id: types.identifier,
  adminId: types.identifier,
  name: types.string,
  year: types.string,
  description: types.string,
  slogan: types.string,
  startedAt: types.string,
  expiredAt: types.string,
});
