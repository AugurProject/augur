import * as Knex from "knex";
import { Address, MarketPriceHistory } from "../../types";

interface MarketPriceHistoryRow {
  outcome: number;
  price: string|number;
  timestamp: number;
}

// Input: MarketID
// Output: { outcome: [{ price, timestamp }] }
export function getMarketPriceHistory(db: Knex, marketID: Address, callback: (err: Error|null, result?: MarketPriceHistory) => void): void {
  db.select([
    "trades.outcome",
    "trades.price",
    "blocks.timestamp",
  ]).from("trades").leftJoin("blocks", "trades.blockNumber", "blocks.blockNumber").where({ marketID })
  .asCallback((err: Error|null, tradesRows?: Array<MarketPriceHistoryRow>): void => {
    if (err) return callback(err);
    if (!tradesRows) return callback(new Error("Internal error retrieving market price history"));
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
