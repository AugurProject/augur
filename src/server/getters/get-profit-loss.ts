import * as t from "io-ts";
import * as Knex from "knex";
import * as _ from "lodash";
import BigNumber from "bignumber.js";
import { promisify } from "util";
import { Augur } from "augur.js";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { getProceedTradeRows } from "./get-proceed-trade-rows";
import {
  Address,
  BlocksRow,
  Payout,
  MarketPricing,
  NormalizedPayout,
  TradingHistoryRow,
  ProceedTradesRow,
  GenericCallback,
} from "../../types";

import {
  queryTradingHistory as queryTradingHistoryCallback,
  normalizePayouts,
} from "./database";


const DEFAULT_NUMBER_OF_BUCKETS = 30;
// Make the math tolerable until we have a chance to fix the BN->Stringness in augur.js
function add(n1: string, n2: string) {
  return new BigNumber(n1, 10).plus(new BigNumber(n2));
}

function sub(n1: string, n2: string) {
  return new BigNumber(n1, 10).minus(new BigNumber(n2));
}

export type ProfitLoss = Record<"position" | "meanOpenPrice" | "realized" | "unrealized" | "total", string>;
export interface EarningsAtTime {
  timestamp: number;
  lastPrice?: string;
  profitLoss?: ProfitLoss | null;
}

export type TradeRow = TradingHistoryRow & { type: string; maker: boolean } | ProceedTradesRow<BigNumber>;
export type PayoutBlockAndPricing= Payout<BigNumber> & BlocksRow & MarketPricing<BigNumber>;

export interface ProfitLossResults {
  aggregate: Array<EarningsAtTime>;
  all: any;
}

// For each group, gather the last trade prices for each bucket, and
// calculate each bucket's profit and loss
export interface MarketOutcomeEarnings {
  marketId: string;
  outcome: number;
  earnings: Array<EarningsAtTime>;
}

export function bucketRangeByInterval(startTime: number, endTime: number, periodInterval: number | null): Array<Timestamped> {
  if (startTime < 0) throw new Error("startTime must be a valid unix timestamp, greater than 0");
  if (endTime < 0) throw new Error("endTime must be a valid unix timestamp, greater than 0");
  if (endTime < startTime) throw new Error("endTime must be greater than or equal startTime");
  if (periodInterval !== null && periodInterval <= 0) throw new Error("periodInterval must be positive integer (seconds)");

  const interval = periodInterval == null ? Math.ceil((endTime - startTime) / DEFAULT_NUMBER_OF_BUCKETS) : periodInterval;

  const buckets: Array<EarningsAtTime> = [];
  for (let bucketEndTime = startTime; bucketEndTime < endTime; bucketEndTime += interval) {
    buckets.push({ timestamp: bucketEndTime });
  }
  buckets.push({ timestamp: endTime });

  return buckets;
}

function sumProfitLossResults(left: EarningsAtTime, right: EarningsAtTime): EarningsAtTime {
  if (left == null) return right;
  if (left.profitLoss == null) return right;
  if (right.profitLoss == null) return left;

  const leftAveragePrice = new BigNumber(left.profitLoss.meanOpenPrice, 10);
  const leftPosition = new BigNumber(left.profitLoss.position, 10);

  const rightAveragePrice = new BigNumber(right.profitLoss.meanOpenPrice, 10);
  const rightPosition = new BigNumber(right.profitLoss.position, 10);

  const position = leftPosition.plus(rightPosition);
  const meanOpenPrice = leftAveragePrice
    .times(leftPosition)
    .plus(rightAveragePrice.times(rightPosition))
    .dividedBy(position);
  const realized = add(left.profitLoss.realized, right.profitLoss.realized);
  const unrealized = add(left.profitLoss.unrealized, right.profitLoss.unrealized);
  const total = realized.plus(unrealized);

  return {
    timestamp: left.timestamp,
    profitLoss: formatBigNumberAsFixed({
      meanOpenPrice,
      position,
      realized,
      unrealized,
      total,
    }),
  };
}

export interface Timestamped {
  timestamp: number
}

export interface ProfitLossTimeseries extends Timestamped {
  account: string;
  marketId: string;
  outcome: number;
  transactionHash: string;
  moneySpent: BigNumber;
  numEscrowed: BigNumber;
  profit: BigNumber;
}

export interface ProfitLossResult extends Timestamped {
  profit: BigNumber;
}

export const GetProfitLossParams = t.type({
  universe: t.string,
  account: t.string,
  marketId: t.union([t.string, t.null]),
  startTime: t.union([t.number, t.null]),
  endTime: t.union([t.number, t.null]),
  periodInterval: t.union([t.number, t.null]),
});

async function queryProfitLossTimeseries(db: Knex, now: number, params: t.TypeOf<typeof GetProfitLossParams>): Promise<Array<ProfitLossTimeseries>> {
  const query = db("profit_loss_timeseries")
    .join("markets", "profit_loss_timeseries.marketId", "markets.marketId")
    .where({ account: params.account, universe: params.universe });

  if (params.marketId !== null) query.where({ marketId: params.marketId });
  if (params.startTime) query.where("timestamp", ">=", params.startTime);
  
  query.where("timestamp", "<=", params.endTime || now);

  return await query;
}

function getProfitAtTimestamps(data: Array<ProfitLossTimeseries>, timestamps: Array<Timestamped>): Array<ProfitLossResult> {
  const profits = [];
  let timestampIndex = 0;
  let dataIndex = 0;
  while(timestampIndex < timestamps.length && dataIndex < data.length) {
    const result = data[dataIndex];
    const bucket = timestamps[timestampIndex];

    if (result.timestamp > bucket.timestamp) {
      if (dataIndex == 0) throw Error("Internal Error: Profit calculation should always begin with valid bucket timestamp");
      profits.push({
        timestamp: bucket.timestamp,
        profit: result.profit,
      });

      timestampIndex++;
    }
    dataIndex++;
  }

  const finalBucketProfit = profits[profits.length - 1].profit;
  while(timestampIndex < timestamps.length) {
    const bucket = timestamps[timestampIndex];
    // If we ran out of results before we ran out of buckets
    // use the last result for each bucket moving forward
    profits.push({
      timestamp: bucket.timestamp,
      profit: finalBucketProfit,
    });
  }

  return profits;
}

export async function getProfitLoss(db: Knex, augur: Augur, params: t.TypeOf<typeof GetProfitLossParams>): Promise<Array<ProfitLossResult>> {
  const now = Date.now();
  const results = await queryProfitLossTimeseries(db, now, params);
  const buckets = bucketRangeByInterval(params.startTime || 0, params.endTime || now, params.periodInterval);

  return getProfitAtTimestamps(results, buckets);
}

