import {
  BUY,
  SELL,
  ASKS,
  BIDS
} from "modules/common/constants";
import { LiquidityOrder, UIOrder, OutcomeOrderBook } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { Getters } from "@augurproject/sdk";

function calcSpread(asks, bids, minPrice, maxPrice) {
  if (asks.length === 0 && bids.length === 0) {
    return maxPrice.plus(minPrice).dividedBy(2);
  } else if (asks.length === 0 && bids.length > 0) {
    return createBigNumber(bids[0].price, 10);
  } else if (asks.length > 0 && bids.length === 0) {
    return createBigNumber(asks[0].price, 10);
  }

  return createBigNumber(asks[0].price, 10)
    .plus(createBigNumber(bids[0].price, 10))
    .dividedBy(2);
}

export function formatOrderBook(outcomesOrderBook: LiquidityOrder[], minPrice?: BigNumber, maxPrice?: BigNumber): OutcomeOrderBook {
	const bids = (outcomesOrderBook || []).filter((order: UIOrder) => order.type === BUY);
  const asks = (outcomesOrderBook || []).filter((order: UIOrder) => order.type === SELL);
  const orderBook: OutcomeOrderBook = {}
  orderBook[ASKS] = asks;
  orderBook[BIDS] = bids;
  orderBook.spread = minPrice && maxPrice && calcSpread(asks, bids, minPrice, maxPrice);
  return orderBook;
}