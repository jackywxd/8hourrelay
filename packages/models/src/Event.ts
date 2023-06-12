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
      name: "Adult Race",
      description: "8 Hour Relay",
      entryFee: 30,
      isCompetitive: true,
      lowerAge: 18,
    }),
    new Race({
      year: "2023",
      name: "Kids",
      description: "4 Hour Youth Relay",
      entryFee: 5,
      isCompetitive: false,
      lowerAge: 10,
      upperAge: 18,
    }),
  ],
});
