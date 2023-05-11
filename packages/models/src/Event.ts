import { Race } from "./Race";

export class Event {
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
