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
  firstName?: string;
  lastName?: string;
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
  team?: string;
  isCaptain?: boolean;
  paymentId?: string;
  sessionId?: string;
  receiptNumber?: string;
  wechatId?: string;
  isPaid?: boolean;
  bib?: string;
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
// @model("8HourRelay/Raceentry")
// export class RaceEntry extends Model({
//   uid: tProp(types.string), // the uid for the user
//   email: tProp(types.string), // the email for the user
//   phone: tProp(types.string), // the email for the user
//   year: tProp(types.string), // the email for the user
//   isActive: tProp(types.boolean), // the uid for the user
//   size: tProp(types.maybe(types.string)), // size of the T-shirt
//   emergencyName: tProp(types.maybe(types.string)).withSetter(), // emergency contact name
//   emergencyPhone: tProp(types.maybe(types.string)).withSetter(), // emergency contact phone
//   race: tProp(types.maybe(types.string)).withSetter(), // participate race name
//   team: tProp(types.maybe(types.string)).withSetter(), // team name
//   isCaptain: tProp(types.maybe(types.boolean)).withSetter(),
//   paymentId: tProp(types.maybe(types.string)).withSetter(), // payment ID in stripe
//   sessionId: tProp(types.maybe(types.string)).withSetter(), // session ID in stripe
//   receiptNumber: tProp(types.maybe(types.string)).withSetter(), // receipt number in stripe
//   isPaid: tProp(types.boolean), // the uid for the user
//   bib: tProp(types.maybe(types.string), () => "Pending").withSetter(),
//   // state: tProp(types.maybe(types.string), () => "Pending").withSetter(),  // state of the race entry:
// }) {}
