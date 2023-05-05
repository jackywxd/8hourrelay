import { types, model, Model, tProp, modelAction, idProp } from "mobx-keystone";

@model("8HourRelay/Team")
export class Team extends Model({
  id: tProp(types.string), // firestore generated Id
  captainId: tProp(types.string).withSetter(), // uid for the admin
  name: tProp(types.string).withSetter(), //team name
  eventId: tProp(types.string), // in which event
  createdAt: tProp(types.number, () => new Date().getTime()),
  updatedAt: tProp(types.number, () => new Date().getTime()).withSetter(),
  expiredAt: tProp(types.number).withSetter(),
  slogan: tProp(types.maybe(types.string)).withSetter(),
  photoUrl: tProp(types.maybe(types.string)).withSetter(),
}) {}
