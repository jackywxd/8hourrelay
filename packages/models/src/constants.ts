export const adultRace = {
  name: "Adult",
  description: "Race for Adults",
  entryFee: 35,
};

export const kidsRace = {
  name: "Kids",
  description: "Race for Kids",
  entryFee: 5,
};

export const relayEvent = {
  name: `8 Hour Realy`,
  year: `2023`,
  location: "TBD",
  time: "Sep 10, 2023",
  isActive: true,
  races: [adultRace, kidsRace],
};
