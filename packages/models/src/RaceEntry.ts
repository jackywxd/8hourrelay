import { event2023 } from "./Event";
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
  medicalInfo?: string; // any medical information you would like to disclose
  race!: string;
  team?: string; // team name
  teamPassword?: string; // team password, should never be saved
  teamId?: string; // team ID
  teamState?: TeamState; //
  isCaptain?: boolean;
  paymentId?: string; // very important, this is ID used for locate the race entry from team
  sessionId?: string;
  receiptNumber?: string;
  wechatId?: string;
  isPaid?: boolean;
  isWaitingList?: boolean; // whether is race entry is waiting list
  bib?: string;
  raceOrder?: number; // the sequence in the team
  raceDuration?: number; // run period in minutes
  raceActualDistance?: number; // run distance in meters this is the result
  raceAdjustedDistance?: number; // run distance in meters this is the result
  raceCoefficient?: number; // coefficient based on the age
  raceStartTime?: string;
  raceEndTime?: string;
  accepted?: boolean; // accepted race waver
  smsOptIn?: boolean;
  emailConsent?: boolean;
  promoCode?: string;
  constructor(r: RaceEntry) {
    Object.assign(this, r);
  }

  get raceDisplayName() {
    const races = event2023.races.filter((r) => r.name === this.race);
    if (races.length === 1) return races[0].description;
    return "";
  }

  get displayName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get entryFee() {
    const races = event2023.races.filter((r) => r.name === this.race);
    if (races.length === 1) return races[0].entryFee;
    return undefined;
  }
  get raceId() {
    return `${this.race}-${this.year}`;
  }
}
