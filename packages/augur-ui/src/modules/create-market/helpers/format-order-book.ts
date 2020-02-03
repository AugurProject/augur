import {
  BUY,
  SELL,
  ASKS,
  BIDS
} from "modules/common/constants";
import { LiquidityOrder, TestTradingOrder, IndividualOutcomeOrderBook } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';

function calcSpread(asks, bids) {
  if (asks.length === 0 || bids.length === 0) {
    return null;
  }

  return createBigNumber(asks[0].price, 10)
    .minus(createBigNumber(bids[0].price, 10));
}

export function formatOrderBook(outcomesOrderBook: LiquidityOrder[] | TestTradingOrder[]): IndividualOutcomeOrderBook {
	const bids = (outcomesOrderBook || []).filter((order) => order.type === BUY);
  const asks = (outcomesOrderBook || []).filter((order) => order.type === SELL);
  const newAsks = asks.sort((a, b) => createBigNumber(a.price).minus(createBigNumber(b.price)));
  const newBids = bids.sort((a, b) => createBigNumber(b.price).minus(createBigNumber(a.price)));
  const spread = calcSpread(newAsks, newBids);
  return {
    [ASKS]: newAsks,
    [BIDS]: newBids,
    spread
  } as IndividualOutcomeOrderBook;
}
