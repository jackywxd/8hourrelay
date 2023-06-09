import { Team } from "./Team";

export class Race {
  teams?: Team[];
  totalTeam?: number;
  totalRunner?: number;
  year: string;
  name: string; // race name: adult or kids
  isCompetitive: boolean; // is this race will calculate result
  description: string;
  entryFee: number;
  lowerAge?: number;
  upperAge?: number;

  constructor({
    year,
    name,
    isCompetitive,
    description,
    entryFee,
    lowerAge,
    upperAge,
  }: {
    year: string;
    name: string; // race name: adult or kids
    isCompetitive: boolean; // is this race will calculate result
    description: string;
    entryFee: number;
    lowerAge?: number;
    upperAge?: number;
  }) {
    this.year = year;
    this.name = name;
    this.entryFee = entryFee;
    this.description = description;
    this.isCompetitive = isCompetitive;
    this.lowerAge = lowerAge;
    this.upperAge = upperAge;
  }

  // check va
  isValid(birthYear: string) {
    let upperYear = "",
      lowerYear = "";

    const year = new Date().getFullYear();
    if (this.lowerAge) upperYear = (year - this.lowerAge).toString();
    console.log(`upperYear`, upperYear);

    if (this.upperAge) lowerYear = (year - this.upperAge).toString();
    console.log(`lowerYear `, lowerYear);

    if (
      upperYear &&
      lowerYear &&
      birthYear <= upperYear &&
      birthYear >= lowerYear
    )
      return true;
    else if (!lowerYear && upperYear && birthYear < upperYear) return true;
    else if (!upperYear && lowerYear && birthYear >= lowerYear) return true;

    return false;
  }
}
