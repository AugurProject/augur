import * as t from "io-ts";
import * as Knex from "knex";
import * as _ from "lodash";
import { Dictionary, NumericDictionary } from "lodash";
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
  account: Address;
  marketId: Address;
  outcome: number;
  transactionHash: string;
  moneySpent: BigNumber;
  numOwned: BigNumber;
  numEscrowed: BigNumber;
  profit: BigNumber;
}

export interface OutcomeValueTimeseries extends Timestamped {
  marketId: Address;
  outcome: number;
  value: BigNumber;
  transactionHash: string;
}

export interface ProfitLossResult extends Timestamped {
  position: BigNumber;
  realized: BigNumber;
  unrealized: BigNumber;
  total: BigNumber;
}

const GetProfitLossSharedParams = t.type({
  universe: t.string,
  account: t.string,
  startTime: t.union([t.number, t.null]),
  endTime: t.union([t.number, t.null]),
  periodInterval: t.union([t.number, t.null]),
});

const MarketIdParams = t.type({
  marketId: t.union([t.string, t.null])
});
export const GetProfitLossParams = t.intersection([GetProfitLossSharedParams, MarketIdParams]);
export interface IGetProfitLossParams extends t.TypeOf<typeof GetProfitLossParams> {};

const MarketIdAndOutcomeParams = t.type({
  marketId: t.string,
  outcome: t.number
});
export const GetOutcomeProfitLossParams = t.intersection([GetProfitLossSharedParams, MarketIdAndOutcomeParams]);
export interface IGetOutcomeProfitLossParams extends t.TypeOf<typeof GetOutcomeProfitLossParams> {};

export function bucketRangeByInterval(startTime: number, endTime: number, periodInterval: number | null): Array<Timestamped> {
  if (startTime < 0) throw new Error("startTime must be a valid unix timestamp, greater than 0");
  if (endTime < 0) throw new Error("endTime must be a valid unix timestamp, greater than 0");
  if (endTime < startTime) throw new Error("endTime must be greater than or equal startTime");
  if (periodInterval !== null && periodInterval <= 0) throw new Error("periodInterval must be positive integer (seconds)");

  const interval = periodInterval == null ? Math.ceil((endTime - startTime) / DEFAULT_NUMBER_OF_BUCKETS) : periodInterval;

  const buckets: Array<Timestamped> = [];
  for (let bucketEndTime = startTime; bucketEndTime < endTime; bucketEndTime += interval) {
    buckets.push({ timestamp: bucketEndTime });
  }
  buckets.push({ timestamp: endTime });

  return buckets;
}

function sumProfitLossResults(left: ProfitLossResult, right: ProfitLossResult): ProfitLossResult {
  if (left == null) return right;

  const leftPosition = new BigNumber(left.position, 10);

  const rightPosition = new BigNumber(right.position, 10);

  const position = leftPosition.plus(rightPosition);
  const realized = left.realized.plus(right.realized);
  const unrealized = left.unrealized.plus(right.unrealized);
  const total = realized.plus(unrealized);

  return {
    timestamp: left.timestamp,
    position,
    realized,
    unrealized,
    total,
  };
}

async function queryProfitLossTimeseries(db: Knex, now: number, params: IGetProfitLossParams): Promise<Array<ProfitLossTimeseries>> {
  const query = db("profit_loss_timeseries")
    .select("profit_loss_timeseries.*", "markets.universe")
    .join("markets", "profit_loss_timeseries.marketId", "markets.marketId")
    .where({ account: params.account, universe: params.universe });

  if (params.marketId !== null) query.where("profit_loss_timeseries.marketId", params.marketId);
  if (params.startTime) query.where("timestamp", ">=", params.startTime);
  
  query.where("timestamp", "<=", params.endTime || now);

  return await query;
}

async function queryOutcomeValueTimeseries(db: Knex, now: number, params: IGetProfitLossParams): Promise<Array<OutcomeValueTimeseries>> {
  const query = db("outcome_value_timeseries")
    .select("outcome_value_timeseries.*", "markets.universe")
    .join("markets", "outcome_value_timeseries.marketId", "markets.marketId");

  if (params.marketId !== null) query.where("outcome_value_timeseries.marketId", params.marketId);
  if (params.startTime) query.where("timestamp", ">=", params.startTime);
  
  query.where("timestamp", "<=", params.endTime || now);

  return await query;
}

function getProfitAtTimestamps(pl: Array<ProfitLossTimeseries>, outcomeValues: Array<OutcomeValueTimeseries>, timestamps: Array<Timestamped>): Array<ProfitLossResult> {
  let remainingPls = pl;
  let plResult: ProfitLossTimeseries|undefined;
  return timestamps.map((bucket: Timestamped) => {
    const plsBeforeBucket = _.takeWhile(remainingPls, (pl) => pl.timestamp < bucket.timestamp)
    if(plsBeforeBucket.length > 0) {
      remainingPls = _.drop(remainingPls, plsBeforeBucket.length);
      plResult = _.last(plsBeforeBucket);
    }

    if (!plResult) throw new Error("Inconsistent data when attempting to generate Profit And Loss");

    const ovResultIndex = _.sortedLastIndexBy(outcomeValues, bucket, "timestamp");
    const ovResult = outcomeValues[ovResultIndex];

    const position = plResult!.numOwned;
    const realized = plResult!.profit;
    const lastPrice = ovResult.value;
    const averagePrice = plResult!.moneySpent.dividedBy(position);
    const unrealized = lastPrice.minus(averagePrice).times(position);
    const total = realized.plus(unrealized);
    return {
      timestamp: bucket.timestamp,
      position,
      realized,
      unrealized,
      total
    };
  });
}

interface ProfitLossData {
  profits: Dictionary<Array<ProfitLossTimeseries>>;
  outcomeValues: Dictionary<Array<OutcomeValueTimeseries>>;
  buckets: Array<Timestamped>;
}

async function getProfitLossData(db: Knex, params: IGetProfitLossParams): Promise<ProfitLossData> {
  const now = Date.now();

  // Realized Profits + Timeseries data about the state of positions
  const profits = _.groupBy(await queryProfitLossTimeseries(db, now, params), ["marketId", "outcome"]);
  if(_.isEmpty(profits)) return { profits: {}, outcomeValues: {}, buckets: [] };

  // The value of an outcome over time, for computing unrealized profit and loss at a time
  const outcomeValues = _.groupBy(await queryOutcomeValueTimeseries(db, now, params), ["maketId", "outcome"]);

  // The timestamps at which we need to return results
  const buckets = bucketRangeByInterval(params.startTime || 0, params.endTime || now, params.periodInterval);
  return {profits, outcomeValues, buckets};
}

type AllOutcomesProfitLoss = Dictionary<Array<ProfitLossResult>>;
export async function getAllOutcomesProfitLoss(db: Knex, augur: Augur, params: IGetProfitLossParams): Promise<AllOutcomesProfitLoss> {
  const { profits, outcomeValues, buckets } = await getProfitLossData(db, params);
  return _.mapValues(profits, (pls, key) => getProfitAtTimestamps(pls, outcomeValues[key], buckets));
}

export async function getOutcomeProfitLoss(db: Knex, augur: Augur, params: IGetOutcomeProfitLossParams): Promise<Array<ProfitLossResult>> {
  const allOutcomesProfitLoss = await getAllOutcomesProfitLoss(db, augur, params);
  return allOutcomesProfitLoss[`${params.marketId}${params.outcome}`];
}

export async function getProfitLoss(db: Knex, augur: Augur, params: IGetProfitLossParams): Promise<Array<ProfitLossResult>> {
  const outcomesProfitLoss = await getAllOutcomesProfitLoss(db, augur, params);
  // List takes us from:
  //  <marketId1><outcome0>: [{timestamp: N,... }, {timestamp: M, ...}, ...]
  //  <marketId1><outcome1>: [{timestamp: N,... }, {timestamp: M, ...}, ...]
  //
  // to:
  // [
  //   [{timestamp: N, ...}, {timestamp: N, ...}],
  //   [{timestamp: M, ...}, {timestamp: M, ...}]
  // ]
  //  
  //
  // This makes it easy to sum across the groups of timestamps
  const bucketsProftLoss = _.zip(..._.values(outcomesProfitLoss));
  return bucketsProftLoss.map((bucketProftLoss: Array<ProfitLossResult>): ProfitLossResult => _.reduce(bucketProftLoss, sumProfitLossResults)!);
}

