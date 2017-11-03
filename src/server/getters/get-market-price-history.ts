import * as Knex from "knex";
import { Address, TimestampedPrice, MarketPriceHistory } from "../../types";
import { queryModifier } from "./database";

interface MarketPriceHistoryRow {
  outcome: number;
  price: string|number;
  timestamp: number;
}

// Input: MarketID
// Output: { outcome: [{ price, timestamp }] }
export function getMarketPriceHistory(db: Knex, marketID: Address, callback: (err: Error|null, result?: MarketPriceHistory) => void): void {
  let query = db.select([
    "trades.outcome",
    "trades.price",
    "blocks.timestamp",
  ]).from("trades").leftJoin("blocks", "trades.blockNumber", "blocks.blockNumber").where({ marketID });
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
