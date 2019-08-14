import {
  BUY,
  SELL,
  ASKS,
  BIDS
} from "modules/common/constants";
import { LiquidityOrder, UIOrder } from 'modules/types';

export function formatOrderBook(outcomeOrderBook: {[outcome: number]: Array<LiquidityOrder> }) {
	const bids = (outcomeOrderBook || []).filter((order: UIOrder) => order.type === BUY);
  const asks = (outcomeOrderBook || []).filter((order: UIOrder) => order.type === SELL);
  outcomeOrderBook = {}
  outcomeOrderBook[ASKS] = asks;
  outcomeOrderBook[BIDS] = bids;
  return outcomeOrderBook;
}