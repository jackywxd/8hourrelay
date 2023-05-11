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
  photoUrl?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  customerId?: string;
  phone?: string;
  address?: string;
  constructor(u: User) {
    Object.assign(this, u);
  }
  get displayName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
