import { TeamState } from "./Team";

export type Gender = "Male" | "Femal";

// entries user can update after register payment
export const editableEntries = [
  "firstName",
  "lastName",
  "preferName",
  "personalBest",
  "email", // for other people's entry
  "phone",
  "gender",
  "size",
  "team",
  "emergencyName",
  "emergencyPhone",
];

export class RaceEntry {
  id!: string;
  firstName!: string;
  lastName!: string;
  preferName?: string;
  birthYear?: string;
  personalBest?: string;
  gender?: Gender;
  uid!: string;
  email!: string;
  phone?: string;
  year!: string;
  isActive!: boolean;
  size?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  race!: string;
  team?: string; // team name
  teamId?: string; // team ID
  teamState?: TeamState; // join a team requires approval
  isCaptain?: boolean;
  paymentId?: string; // very important, this is ID used for locate the race entry from team
  sessionId?: string;
  receiptNumber?: string;
  wechatId?: string;
  isPaid?: boolean;
  bib?: string;
  raceOrder?: number; // the sequence in the team
  raceDuration?: number; // run period in minutes
  raceActualDistance?: number; // run distance in meters this is the result
  raceAdjustedDistance?: number; // run distance in meters this is the result
  raceCoefficient?: number; // coefficient based on the age
  raceStartTime?: string;
  raceEndTime?: string;
  constructor(r: RaceEntry) {
    Object.assign(this, r);
  }
  get displayName() {
    return `${this.firstName} ${this.lastName}`;
  }
  get entryFee() {
    if (this.race === "Adult") return 30;
    if (this.race === "Kids") return 5;
    return undefined;
  }
  get raceId() {
    return `${this.race}-${this.year}`;
  }
}
