import * as t from 'io-ts';

const Order = t.type({
  price: t.string,
  amount: t.string,
});
const OutcomeOrderBook = t.type({
  bids: t.array(Order),
  asks: t.array(Order),
});
export const OrderBookParams = t.dictionary(t.string, OutcomeOrderBook);
export const OrderBook = t.dictionary(t.string, OutcomeOrderBook);
export type OrderBookType = t.TypeOf<typeof OrderBook>;
