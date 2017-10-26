import * as Knex from "knex";
import { Address, TimestampedPrice, MarketPriceHistory } from "../../types";
import { sortDirection } from "../../utils/sort-direction";

interface MarketPriceHistoryRow {
  outcome: number;
  price: string|number;
  timestamp: number;
}

// Input: MarketID
// Output: { outcome: [{ price, timestamp }] }
export function getMarketPriceHistory(db: Knex, marketID: Address|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: MarketPriceHistory) => void): void {
  let query = db.select([
    "trades.outcome",
    "trades.price",
    "blocks.timestamp",
  ]).from("trades").leftJoin("blocks", "trades.blockNumber", "blocks.blockNumber").where({ marketID }).orderBy(sortBy || "blocks.timestamp", sortDirection(isSortDescending, "desc"));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  query.asCallback((err: Error|null, tradesRows?: Array<MarketPriceHistoryRow>): void => {
    if (err) return callback(err);
    if (!tradesRows || !tradesRows.length) return callback(null);
    const marketPriceHistory: MarketPriceHistory = {};
    tradesRows.forEach((trade: MarketPriceHistoryRow): void => {
      if (!marketPriceHistory[trade.outcome]) marketPriceHistory[trade.outcome] = [];
      marketPriceHistory[trade.outcome].push({
        price: trade.price,
        timestamp: trade.timestamp,
      });
    });
    callback(null, marketPriceHistory);
  });
}
