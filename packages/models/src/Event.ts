import { Race } from "./Race";

class Event {
  name: string; // name of the event
  year: string; // year
  location: string; //location of the event
  time: string; // when the event will happen
  registerDeadline: string; // when the event will happen
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
    this.registerDeadline = e.registerDeadline;
  }
}

const year = new Date().getFullYear().toString();
export const event2023 = new Event({
  year,
  name: `8HourRealy`,
  description: `8 Hour Realy Race - 2023`,
  location: "Minoru Oval, Athletic field in Richmond, British Columbia",
  time: "Sep 10, 2023",
  isActive: true,
  createdAt: new Date().getTime(),
  registerDeadline: "August 31, 2023",
  races: [
    new Race({
      year,
      name: "Adult Race",
      description: "8 Hour Relay",
      entryFee: 30,
      isCompetitive: true,
      lowerAge: 18,
    }),
    new Race({
      year,
      name: "Kids",
      description: "4 Hour Youth Relay",
      entryFee: 10,
      isCompetitive: false,
      lowerAge: 10,
      upperAge: 18,
    }),
  ],
});
