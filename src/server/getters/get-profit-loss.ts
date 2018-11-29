import * as t from "io-ts";
import * as Knex from "knex";
import * as _ from "lodash";
import BigNumber from "bignumber.js";
import { promisify } from "util";
import { Augur } from "augur.js";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { getProceedTradeRows } from "./get-proceed-trade-rows";
import { ZERO } from "../../constants";
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
  position: BigNumber;
  realized: BigNumber;
  unrealized: BigNumber;
  total: BigNumber;
}

export const GetProfitLossParams = t.type({
  universe: t.string,
  account: t.string,
  marketId: t.union([t.string, t.null]),
  startTime: t.union([t.number, t.null]),
  endTime: t.union([t.number, t.null]),
  periodInterval: t.union([t.number, t.null]),
});

export interface GetOutcomeProfitLossParams extends t.TypeOf<typeof GetProfitLossParams> {
  outcome: number
}

export function bucketRangeByInterval(startTime: number, endTime: number, periodInterval: number | null): Array<Timestamped> {
  if (startTime < 0) throw new Error("startTime must be a valid unix timestamp, greater than 0");
  if (endTime < 0) throw new Error("endTime must be a valid unix timestamp, greater than 0");
  if (endTime < startTime) throw new Error("endTime must be greater than or equal startTime");
  if (periodInterval !== null && periodInterval <= 0) throw new Error("periodInterval must be positive integer (seconds)");

  const interval = periodInterval == null ? Math.ceil((endTime - startTime) / DEFAULT_NUMBER_OF_BUCKETS) : periodInterval;

  console.log('Start time: ', startTime, 'End Time: ', endTime, 'Interval (minutes)', interval/60);

  const buckets: Array<Timestamped> = [];
  for (let bucketEndTime = startTime; bucketEndTime < endTime; bucketEndTime += interval) {
    buckets.push({ timestamp: bucketEndTime });
  }
  buckets.push({ timestamp: endTime });

  return buckets;
}

async function queryProfitLossTimeseries(db: Knex, now: number, params: t.TypeOf<typeof GetProfitLossParams>): Promise<Array<ProfitLossTimeseries>> {
  const query = db("profit_loss_timeseries")
    .select("profit_loss_timeseries.*", "markets.universe")
    .join("markets", "profit_loss_timeseries.marketId", "markets.marketId")
    .where({ account: params.account, universe: params.universe });

  if (params.startTime) query.where("timestamp", ">=", params.startTime);
  
  query.where("timestamp", "<=", params.endTime || now);

  return await query;
}

function getProfitAtTimestamps(data: Array<ProfitLossTimeseries>, timestamps: Array<Timestamped>): Array<ProfitLossResult> {
  const profits: Array<ProfitLossResult> = [];
  let timestampIndex = 0;
  let dataIndex = 0;
  while(timestampIndex < timestamps.length && dataIndex < data.length) {
    const result = data[dataIndex];
    const bucket = timestamps[timestampIndex];
    console.log("Timestamp: ", bucket.timestamp, "Result: ", result.timestamp);

    if (result.timestamp > bucket.timestamp) {
      profits.push({
        timestamp: bucket.timestamp,
        realized: result.profit,
        unrealized: ZERO,
        position: ZERO
      });

      timestampIndex++;
    }
    dataIndex++;
  }


  const finalBucketProfit = profits[profits.length - 1].realized;
  while(timestampIndex < timestamps.length) {
    const bucket = timestamps[timestampIndex];
    // If we ran out of results before we ran out of buckets
    // use the last result for each bucket moving forward
    profits.push({
      timestamp: bucket.timestamp,
      realized: finalBucketProfit,
      unrealized: ZERO,
      position: ZERO
    });

    timestampIndex++;
  }

  return profits;
}

interface ProfitLossData {
  results: Array<ProfitLossTimeseries>;
  buckets: Array<Timestamped>;
}

async function getProfitLossData(db: Knex, params: t.TypeOf<typeof GetProfitLossParams>): Promise<ProfitLossData> {
  const now = Date.now();
  const results = await queryProfitLossTimeseries(db, now, params);
  if( results.length === 0 ) return { results: [], buckets: [] };
  const buckets = bucketRangeByInterval(params.startTime || 0, params.endTime || now, params.periodInterval);
  return {results, buckets};
}

export async function getOutcomeProfitLoss(db: Knex, augur: Augur, params: GetOutcomeProfitLossParams): Promise<Array<ProfitLossResult>> {
  const { results, buckets } = await getProfitLossData(db, params);
  const outcomeResults = results.filter((result) => result.outcome == params.outcome);
  return getProfitAtTimestamps(outcomeResults, buckets);
}

export async function getProfitLoss(db: Knex, augur: Augur, params: t.TypeOf<typeof GetProfitLossParams>): Promise<Array<ProfitLossResult>> {
  const { results, buckets } = await getProfitLossData(db, params);
  return getProfitAtTimestamps(results, buckets);
}

