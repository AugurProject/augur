import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, MarketPriceHistory, TimestampedPriceAmount } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

interface MarketPriceHistoryRow {
  timestamp: number;
  outcome: number;
  price: BigNumber;
  amount: BigNumber;
}

// Input: MarketId
// Output: { outcome: [{ price, timestamp }] }
export function getMarketPriceHistory(db: Knex, marketId: Address, callback: (err: Error|null, result?: MarketPriceHistory<string>) => void): void {
  db.select([
    "trades.outcome",
    "trades.price",
    "trades.amount",
    "blocks.timestamp",
  ]).from("trades").leftJoin("blocks", "trades.blockNumber", "blocks.blockNumber").where({ marketId })
  .asCallback((err: Error|null, tradesRows?: Array<MarketPriceHistoryRow>): void => {
    if (err) return callback(err);
    if (!tradesRows) return callback(new Error("Internal error retrieving market price history"));
    const marketPriceHistory: MarketPriceHistory<string> = {};
    tradesRows.forEach((trade: MarketPriceHistoryRow): void => {
      if (!marketPriceHistory[trade.outcome]) marketPriceHistory[trade.outcome] = [];
      marketPriceHistory[trade.outcome].push(formatBigNumberAsFixed<TimestampedPriceAmount<BigNumber>, TimestampedPriceAmount<string>>({
        price: trade.price,
        timestamp: trade.timestamp,
        amount: trade.amount,
      }));
    });
    callback(null, marketPriceHistory);
  });
}
