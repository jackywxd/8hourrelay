import { Gender } from "./RaceEntry";

export class User {
  uid!: string;
  email!: string;
  emailVerified!: boolean;
  createdAt!: number;
  updatedAt!: number;
  firstName?: string;
  lastName?: string;
  preferName?: string;
  gender?: Gender;
  wechatId?: string;
  birthYear?: string;
  personalBest?: string;
  image?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  customerId?: string;
  phone?: string;
  address?: string;
  provider?: string;
  // this value is the year of race, if it is set, the user created a team for that year;
  // so next year user can creat a new team again
  teamYear?: "2023" | "2024";
  constructor(u: User) {
    Object.assign(this, u);
  }
  get displayName() {
    return this.preferName
      ? this.preferName
      : this.firstName && this.lastName
      ? `${this.firstName} ${this.lastName}`
      : this.firstName
      ? this.firstName
      : this.lastName
      ? this.lastName
      : "";
  }
  get name() {
    return this.preferName
      ? this.preferName
      : this.firstName && this.lastName
      ? `${this.firstName} ${this.lastName}`
      : this.firstName
      ? this.firstName
      : this.lastName
      ? this.lastName
      : "";
  }
}
