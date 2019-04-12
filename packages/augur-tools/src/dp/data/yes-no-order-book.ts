export const singleOutcomeBids = [
  { "shares": "0.001", "price": "0.28" },
  { "shares": "0.002", "price": "0.25" },
  { "shares": "0.003", "price": "0.19" }
];

export const singleOutcomeAsks = [
  { "shares": "0.001", "price": "0.31" },
  { "shares": "0.002", "price": "0.35" },
  { "shares": "0.003", "price": "0.40" }
];

export const yesNoOrderBook = {
  buy: { 1: singleOutcomeBids },
  sell: { 1: singleOutcomeAsks
  }
};

