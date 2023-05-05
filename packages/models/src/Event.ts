import { types, model, Model, tProp, SnapshotOutOf } from "mobx-keystone";
import { computed } from "mobx";
import { Race } from "./Race";

export type IEvent = SnapshotOutOf<Event>;

// Model for the 8 Hour Relay Event
@model("8HourRelay/Event")
export class Event extends Model({
  name: tProp(types.string).withSetter(), // year of the race
  year: tProp(types.string, () =>
    new Date().getFullYear().toString()
  ).withSetter(), // year of the race
  location: tProp(types.string), // location will held the event
  time: tProp(types.string).withSetter(), // event time
  description: tProp(types.maybe(types.string)), // description
  isActive: tProp(types.boolean),
  createdAt: tProp(types.number, () => new Date().getTime()),
  expiredAt: tProp(types.number, () => new Date().getTime()),
  races: tProp(types.maybe(types.array(types.model(Race)))),
}) {
  @computed
  get id() {
    return `${this.name}-${this.year}`;
  }
}
