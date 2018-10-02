import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, MarketPriceHistory, TimestampedPriceAmount } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import * as _ from "lodash";
import Augur from "augur.js";

interface MarketPriceHistoryRow {
  timestamp: number;
  outcome: number;
  price: BigNumber;
  amount: BigNumber;
}

export interface GetMarketPriceHistoryParams {
  marketId: Address;
}

export function extractGetMarketPriceHistoryParams(params: any): GetMarketPriceHistoryParams|undefined {
  const pickedParams = _.pick(params, ["marketId"]);
  if (isGetMarketPriceHistoryParams(pickedParams)) return pickedParams;
  return undefined;
}

export function isGetMarketPriceHistoryParams(params: any): params is GetMarketPriceHistoryParams {
  if (!_.isObject(params)) return false;
  return _.isString(params.marketId);

}

// Input: MarketId
// Output: { outcome: [{ price, timestamp }] }
export async function getMarketPriceHistory(db: Knex, augur: Augur, params: GetMarketPriceHistoryParams): Promise<MarketPriceHistory<string>> {
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
