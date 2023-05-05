import { types, model, Model, tProp } from "mobx-keystone";
import { computed } from "mobx";

@model("8HourRelay/Raceentry")
export class RaceEntry extends Model({
  uid: tProp(types.string), // the uid for the user
  isActive: tProp(types.boolean), // the uid for the user
  size: tProp(types.maybe(types.string)), // size of the T-shirt
  emergencyName: tProp(types.maybe(types.string)).withSetter(), // emergency contact name
  emergencyPhone: tProp(types.maybe(types.string)).withSetter(), // emergency contact phone
  race: tProp(types.maybe(types.string)).withSetter(), // participate race name
  team: tProp(types.maybe(types.string)).withSetter(), // team name
  isCaptain: tProp(types.maybe(types.boolean)).withSetter(),
  paymentId: tProp(types.maybe(types.string)).withSetter(), // payment ID in stripe
  sessionId: tProp(types.maybe(types.string)).withSetter(), // session ID in stripe
  receiptNumber: tProp(types.maybe(types.string)).withSetter(), // receipt number in stripe
  bib: tProp(types.maybe(types.string), () => "Pending").withSetter(),
}) {
  @computed
  get isPaid() {
    return this.paymentId && this.sessionId;
  }
}
