import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import Augur from "augur.js";
import { Address, MarketPriceHistory, TimestampedPriceAmount } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import * as t from "io-ts";

export const MarketPriceHistoryParams = t.type({
  marketId: t.string,
});

interface MarketPriceHistoryRow {
  timestamp: number;
  outcome: number;
  price: BigNumber;
  amount: BigNumber;
}

// Input: MarketId
// Output: { outcome: [{ price, timestamp }] }
export async function getMarketPriceHistory(db: Knex, augur: Augur, params: t.TypeOf<typeof MarketPriceHistoryParams>): Promise<MarketPriceHistory<string>> {
  const tradesRows: Array<MarketPriceHistoryRow> = await db.select([
    "trades.outcome",
    "trades.price",
    "trades.amount",
    "blocks.timestamp",
  ]).from("trades").leftJoin("blocks", "trades.blockNumber", "blocks.blockNumber").where({ marketId: params.marketId });
  if (!tradesRows) throw new Error("Internal error retrieving market price history");
  const marketPriceHistory: MarketPriceHistory<string> = {};
  tradesRows.forEach((trade: MarketPriceHistoryRow): void => {
    if (!marketPriceHistory[trade.outcome]) marketPriceHistory[trade.outcome] = [];
    marketPriceHistory[trade.outcome].push(formatBigNumberAsFixed<TimestampedPriceAmount<BigNumber>, TimestampedPriceAmount<string>>({
      price: trade.price,
      timestamp: trade.timestamp,
      amount: trade.amount,
    }));
  });
  return marketPriceHistory;
}
