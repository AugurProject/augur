import * as Knex from "knex";
import { Address, TimestampedPrice, MarketPriceHistory } from "../../types";
import { sortDirection } from "../../utils/sort-direction";

interface MarketPriceHistoryTradesRow {
  outcome: number;
  price: string|number;
  tradeTime: number;
}

// Input: MarketID
// Output: { outcome: [{ price, timestamp }] }
export function getMarketPriceHistory(db: Knex, marketID: Address|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: MarketPriceHistory) => void): void {
  const columnsToSelect: Array<string> = ["outcome", "price", "tradeTime"];
  let query: Knex.QueryBuilder = db.select(columnsToSelect).from("trades").where({ marketID }).orderBy(sortBy || "tradeTime", sortDirection(isSortDescending, "desc"));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  query.asCallback((err: Error|null, tradesRows?: Array<MarketPriceHistoryTradesRow>): void => {
    if (err) return callback(err);
    if (!tradesRows || !tradesRows.length) return callback(null);
    const marketPriceHistory: MarketPriceHistory = {};
    tradesRows.forEach((trade: MarketPriceHistoryTradesRow): void => {
      if (!marketPriceHistory[trade.outcome]) marketPriceHistory[trade.outcome] = [];
      marketPriceHistory[trade.outcome].push({
        price: trade.price,
        timestamp: trade.tradeTime,
      });
    });
    callback(null, marketPriceHistory);
  });
}
