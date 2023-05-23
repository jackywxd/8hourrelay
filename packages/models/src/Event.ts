import { Race } from "./Race";

class Event {
  name: string; // name of the event
  year: string; // year
  location: string; //location of the event
  time: string; // when the event will happen
  description: string;
  isActive: boolean; // passed year will be set to false
  createdAt: number;
  updatedAt?: number;
  races: Race[];
  constructor(e: Event) {
    this.name = e.name;
    this.year = e.year;
    this.location = e.location;
    this.time = e.time;
    this.description = e.description;
    this.isActive = e.isActive;
    this.createdAt = e.createdAt ?? new Date().getTime();
    this.races = e.races;
  }
}

export const event2023 = new Event({
  name: `8HourRealy`,
  description: `8 Hour Realy Race - 2023`,
  year: `2023`,
  location: "TBD",
  time: "Sep 10, 2023",
  isActive: true,
  createdAt: new Date().getTime(),
  races: [
    new Race({
      year: "2023",
      name: "Adult",
      description: "Adult Race",
      entryFee: 30,
      isCompetitive: true,
    }),
    new Race({
      year: "2023",
      name: "Adult",
      description: "Adult Entertainment Run",
      entryFee: 30,
      isCompetitive: false,
    }),
    new Race({
      year: "2023",
      name: "Kids",
      description: "Kids run",
      entryFee: 5,
      isCompetitive: false,
    }),
  ],
});
