export interface SharePrice {
  shares: string;
  price: string;
}

export interface OrderBook {
  buy: { [x:number]: Array<SharePrice>};
  sell: { [x:number]: Array<SharePrice>};
}

export const singleOutcomeBids:Array<SharePrice> = [
  { "shares": "0.001", "price": "0.28" },
  { "shares": "0.002", "price": "0.25" },
  { "shares": "0.003", "price": "0.19" }
];

export const singleOutcomeAsks:Array<SharePrice> = [
  { "shares": "0.001", "price": "0.31" },
  { "shares": "0.002", "price": "0.35" },
  { "shares": "0.003", "price": "0.40" }
];

export const yesNoOrderBook:OrderBook = {
  buy: { 1: singleOutcomeBids },
  sell: { 1: singleOutcomeAsks
  }
};

