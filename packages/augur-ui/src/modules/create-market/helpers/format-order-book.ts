import {
  BUY,
  SELL,
  ASKS,
  BIDS
} from "modules/common/constants";
import { LiquidityOrder, UIOrder } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';

function calcSpread(asks, bids, minPrice, maxPrice) {
  console.log(asks);
  console.log(bids);
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

export function formatOrderBook(outcomeOrderBook: {[outcome: number]: Array<LiquidityOrder> }, minPrice?: BigNumber, maxPrice?: BigNumber) {
	const bids = (outcomeOrderBook || []).filter((order: UIOrder) => order.type === BUY);
  const asks = (outcomeOrderBook || []).filter((order: UIOrder) => order.type === SELL);
  outcomeOrderBook = {}
  outcomeOrderBook[ASKS] = asks;
  outcomeOrderBook[BIDS] = bids;
  outcomeOrderBook.spread = minPrice && maxPrice && calcSpread(asks, bids, minPrice, maxPrice);
  return outcomeOrderBook;
}