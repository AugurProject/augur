import {
  BUY,
  SELL,
  ASKS,
  BIDS
} from "modules/common/constants";

export function formatOrderBook(outcomeOrderBook) {
	const bids = (outcomeOrderBook || []).filter(order => order.type === BUY);
  const asks = (outcomeOrderBook || []).filter(order => order.type === SELL);
  outcomeOrderBook = {}
  outcomeOrderBook[ASKS] = asks;
  outcomeOrderBook[BIDS] = bids;
  return outcomeOrderBook;
}