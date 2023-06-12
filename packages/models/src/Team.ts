import { event2023 } from "./Event";

export type TeamState = "APPROVED" | "PENDING" | "DENIED";

export class Team {
  id!: string; //team ID
  captainEmail!: string; // current captain email; could be changed later
  captainName!: string; // current captain Name
  name!: string;
  year!: string;
  race!: string; // adult or Kids
  createdBy!: string; // user ID who create this team
  createdAt!: number;
  updatedAt!: number;
  slogan!: string;
  photoUrl!: string;
  password?: string;
  isOpen: boolean = true; // whethere the team is open for team members
  teamMembers?: string[]; // paymentId of the team members maximum 24 members
  waitingList?: string[]; // waiting list members
  state: TeamState = "PENDING"; // new team required approval before public access
  constructor(t: Team) {
    Object.assign(this, t);
  }

  get raceDisplayName() {
    const races = event2023.races.filter((r) => r.name === this.race);
    if (races.length === 1) return races[0].description;
    return "";
  }

  get displayName() {
    if (this.name)
      return this.name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    else return "";
  }
  // the total distance of this team
  // get totalDistance() {
  //   if (this.teamMembers && this.teamMembers.length > 0) {
  //     this.teamMembers
  //       .map((m) => m.distance ?? 0)
  //       .reduce((a, b) => {
  //         return a + b;
  //       }, 0);
  //   }
  //   return 0;
  // }
}
