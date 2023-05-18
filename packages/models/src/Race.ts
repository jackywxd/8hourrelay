import { Team } from "./Team";

export class Race {
  teams?: Team[];
  totalTeam?: number;
  totalRunner?: number;

  constructor(
    public year: string,
    public name: string, // race name: adult or kids
    public location: string, // race name: adult or kids
    public description: string,
    public entryFee: number
  ) {}
}
