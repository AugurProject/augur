import {
  BUY,
  SELL,
  ASKS,
  BIDS
} from "modules/common/constants";
import { LiquidityOrder, UIOrder, OutcomeOrderBook } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { Getters } from "@augurproject/sdk";

function calcSpread(asks, bids) {
  if (asks.length === 0 || bids.length === 0) {
    return null;
  }

  return createBigNumber(asks[0].price, 10)
    .minus(createBigNumber(bids[0].price, 10));
}

export function formatOrderBook(outcomesOrderBook: LiquidityOrder[]): OutcomeOrderBook {
	const bids = (outcomesOrderBook || []).filter((order: UIOrder) => order.type === BUY);
  const asks = (outcomesOrderBook || []).filter((order: UIOrder) => order.type === SELL);
  const orderBook: OutcomeOrderBook = {}
  orderBook[ASKS] = asks.sort((a, b) => createBigNumber(a.price).minus(createBigNumber(b.price)));
  orderBook[BIDS] = bids.sort((a, b) => createBigNumber(b.price).minus(createBigNumber(a.price)));
  console.log(orderBook[ASKS]);
  console.log(orderBook[BIDS])
  orderBook.spread = calcSpread(orderBook[ASKS], orderBook[BIDS]);
  return orderBook;
}