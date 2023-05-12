import { RaceEntry } from "./RaceEntry";

export class Team {
  id!: string;
  captainEmail!: string;
  name!: string;
  year!: string;
  race!: string; // adult or Kids
  eventId!: string;
  createdBy!: string;
  createdAt!: number;
  updatedAt!: number;
  slogan!: string;
  photoUrl!: string;
  teamMembers?: RaceEntry[];
  constructor(t: Team) {
    Object.assign(this, t);
  }
}
