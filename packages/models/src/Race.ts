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

  constructor({
    year,
    name,
    isCompetitive,
    description,
    entryFee,
  }: {
    year: string;
    name: string; // race name: adult or kids
    isCompetitive: boolean; // is this race will calculate result
    description: string;
    entryFee: number;
  }) {
    this.year = year;
    this.name = name;
    this.entryFee = entryFee;
    this.description = description;
    this.isCompetitive = isCompetitive;
  }
}
