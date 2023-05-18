export type TeamState = "APPROVED" | "PENDING" | "DENIED";
export class Team {
  id!: string;
  captainEmail!: string; // current captain email; could be changed later
  name!: string;
  year!: string;
  race!: string; // adult or Kids
  createdBy!: string; // user ID who create this team
  createdAt!: number;
  updatedAt!: number;
  slogan!: string;
  photoUrl!: string;
  teamMembers?: string[]; // paymentId of the team members
  state: TeamState = "PENDING";
  constructor(t: Team) {
    Object.assign(this, t);
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
