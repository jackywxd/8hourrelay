import { Model, model, prop } from "mobx-keystone";
import { Event, Race } from "@8hourrelay/models";

@model("8HourRelay/EventStore")
export class EventStore extends Model({
  event: prop<Event>(
    () =>
      new Event({
        name: `8 Hour Realy`,
        year: `2023`,
        location: "TBD",
        time: "Sep 10, 2023",
        isActive: true,
        races: [
          new Race({
            name: "Adult",
            description: "Race for Adults",
            entryFee: 35,
          }),
          new Race({
            name: "Kids",
            description: "Race for Kids",
            entryFee: 5,
          }),
        ],
      })
  ),
}) {}
