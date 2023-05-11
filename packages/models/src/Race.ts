export class Race {
  constructor(
    public eventId: string,
    public name: string, // race name: adult or kids
    public description: string,
    public entryFee: number
  ) {}
}

// @model("8HourRelay/Race")
// export class Race extends Model({
//   name: tProp(types.string), // race name: Adult Run or Kids Run
//   entryFee: tProp(types.number), // entry fee for the Race
//   description: tProp(types.maybe(types.string)),
// }) {
//   @computed
//   get raceId() {
//     const parent: Event | undefined = getParent(this);
//     if (parent) return `${parent.name}-${parent.year}-${this.name}`;
//     return null;
//   }
// }
