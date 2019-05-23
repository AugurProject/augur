import * as t from "io-ts";
import Knex from "knex";
import * as _ from "lodash";
import { Dictionary, NumericDictionary } from "lodash";
import { Address, Augur, BigNumber } from "../../types";
import { getCurrentTime } from "../../blockchain/process-block";

import { ZERO } from "../../constants";

const DEFAULT_NUMBER_OF_BUCKETS = 30;

export interface Timestamped {
  timestamp: number;
}

export interface ProfitLossTimeseries extends Timestamped {
  account: Address;
  marketId: Address;
  outcome: number;
  transactionHash: string;
  moneySpent: BigNumber;
  numOwned: BigNumber;
  numEscrowed: BigNumber;
  numOutcomes: number;
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
  averagePrice: BigNumber;
  cost: BigNumber;
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
  marketId: t.union([t.string, t.null]),
});
export const GetProfitLossParams = t.intersection([GetProfitLossSharedParams, MarketIdParams]);
export type GetProfitLossParamsType = t.TypeOf<typeof GetProfitLossParams>;

const MarketIdAndOutcomeParams = t.type({
  marketId: t.string,
  outcome: t.number,
});
export const GetOutcomeProfitLossParams = t.intersection([GetProfitLossSharedParams, MarketIdAndOutcomeParams]);
export type GetOutcomeProfitLossParamsType = t.TypeOf<typeof GetOutcomeProfitLossParams>;

export const GetProfitLossSummaryParams = t.intersection([t.type({
  universe: t.string,
  account: t.string,
  marketId: t.union([t.string, t.null]),
}), t.partial({
  endTime: t.number,
})]);
export type GetProfitLossSummaryParamsType = t.TypeOf<typeof GetProfitLossSummaryParams>;

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

export function sumProfitLossResults<T extends ProfitLossResult>(left: T, right: T): T {
  const leftPosition = new BigNumber(left.position);
  const rightPosition = new BigNumber(right.position);

  const position = leftPosition.plus(rightPosition);
  const realized = left.realized.plus(right.realized);
  const unrealized = left.unrealized.plus(right.unrealized);
  const total = realized.plus(unrealized);
  const cost = left.cost.plus(right.cost);
  const averagePrice = position.gt(ZERO) ? cost.div(position) : ZERO;

  return Object.assign(_.clone(left), {
    position,
    realized,
    unrealized,
    total,
    cost,
    averagePrice,
  });
}

async function queryProfitLossTimeseries(db: Knex, now: number, params: GetProfitLossParamsType): Promise<Array<ProfitLossTimeseries>> {
  const query = db("profit_loss_timeseries")
    .select("profit_loss_timeseries.*", "markets.universe", "markets.numOutcomes")
    .join("markets", "profit_loss_timeseries.marketId", "markets.marketId")
    .where({ account: params.account, universe: params.universe })
    .orderBy("timestamp");

  if (params.marketId !== null) query.where("profit_loss_timeseries.marketId", params.marketId);
  if (params.startTime) query.where("timestamp", ">=", params.startTime);

  query.where("timestamp", "<=", params.endTime || now);

  return await query;
}

async function queryOutcomeValueTimeseries(db: Knex, now: number, params: GetProfitLossParamsType): Promise<Array<OutcomeValueTimeseries>> {
  const query = db("outcome_value_timeseries")
    .select("outcome_value_timeseries.*", "markets.universe")
    .join("markets", "outcome_value_timeseries.marketId", "markets.marketId")
    .orderBy("timestamp");

  if (params.marketId !== null) query.where("outcome_value_timeseries.marketId", params.marketId);
  if (params.startTime) query.where("timestamp", ">=", params.startTime);

  query.where("timestamp", "<=", params.endTime || now);

  return await query;
}

function getProfitAtTimestamps(pl: Array<ProfitLossTimeseries>, outcomeValues: Array<OutcomeValueTimeseries>, timestamps: Array<Timestamped>): Array<ProfitLossResult> {
  let remainingPls = pl;
  let plResult: ProfitLossTimeseries|undefined;
  return timestamps.map((bucket: Timestamped) => {
    const plsBeforeBucket = _.takeWhile(remainingPls, (pl) => pl.timestamp <= bucket.timestamp);
    if (plsBeforeBucket.length > 0) {
      remainingPls = _.drop(remainingPls, plsBeforeBucket.length);
      plResult = _.last(plsBeforeBucket);
    }

    if (!plResult) {
      return {
        timestamp: bucket.timestamp,
        position: ZERO,
        realized: ZERO,
        unrealized: ZERO,
        total: ZERO,
        cost: ZERO,
        averagePrice: ZERO,
      };
    }

    const position = plResult!.numOwned;
    const realized = plResult!.profit;
    const cost = plResult!.moneySpent;
    const averagePrice = position.gt(ZERO) ? cost.div(position) : ZERO;

    let lastPrice = ZERO;
    let unrealized = ZERO;

    if (typeof outcomeValues !== "undefined") {
      const ovResultIndex = Math.max(0, _.sortedLastIndexBy(outcomeValues, bucket, "timestamp") - 1);
      const ovResult = outcomeValues[ovResultIndex];
      lastPrice = ovResult.value;
      unrealized = lastPrice.multipliedBy(position).minus(cost);
    }

    const total = realized.plus(unrealized);
    return {
      timestamp: bucket.timestamp,
      position,
      realized,
      unrealized,
      total,
      averagePrice,
      cost,
    };
  });
}

interface ProfitLossData {
  profits: Dictionary<Array<ProfitLossTimeseries>>;
  outcomeValues: Dictionary<Array<OutcomeValueTimeseries>>;
  buckets: Array<Timestamped>;
}

async function getProfitLossData(db: Knex, params: GetProfitLossParamsType): Promise<ProfitLossData> {
  const now = getCurrentTime();

  // Realized Profits + Timeseries data about the state of positions
  const profitsOverTime = await queryProfitLossTimeseries(db, now, params);
  const profits = _.groupBy(profitsOverTime, (r) => [r.marketId, r.outcome].join(","));

  // Type there are no trades in this window then we'll
  if (_.isEmpty(profits))  {
    const buckets = bucketRangeByInterval(params.startTime || 0, params.endTime || now, params.periodInterval);
    return {profits: {}, outcomeValues: {}, buckets};
  }

  // The value of an outcome over time, for computing unrealized profit and loss at a time
  const outcomeValues = _.groupBy(await queryOutcomeValueTimeseries(db, now, params), (r) => [r.marketId, r.outcome].join(","));

  // The timestamps at which we need to return results
  const buckets = bucketRangeByInterval(params.startTime || profitsOverTime[0].timestamp, Math.min(_.last(profitsOverTime)!.timestamp, now), params.periodInterval || null);
  return {profits, outcomeValues, buckets};
}

export interface AllOutcomesProfitLoss {
  profit: Dictionary<Array<ProfitLossResult>>;
  buckets: Array<Timestamped>;
  marketOutcomes: Dictionary<number>;
}
export async function getAllOutcomesProfitLoss(db: Knex, augur: Augur, params: GetProfitLossParamsType): Promise<AllOutcomesProfitLoss> {
  const { profits, outcomeValues, buckets } = await getProfitLossData(db, params);
  return {
    profit: _.mapValues(profits, (pls, key) => {
      return getProfitAtTimestamps(pls, outcomeValues[key], buckets);
    }),
    marketOutcomes: _.fromPairs(_.values(_.mapValues(profits, (pls) => {
      const  first = _.first(pls)!;
      return [first.marketId, first.numOutcomes];
    }))),
    buckets,
  };
}

export async function getProfitLoss(db: Knex, augur: Augur, params: GetProfitLossParamsType): Promise<Array<ProfitLossResult>> {
  const {profit: outcomesProfitLoss, buckets }  = await getAllOutcomesProfitLoss(db, augur, params);
  if (_.isEmpty(outcomesProfitLoss)) {
    return buckets.map((bucket) => ({
      timestamp: bucket.timestamp,
      position: ZERO,
      realized: ZERO,
      unrealized: ZERO,
      total: ZERO,
      cost: ZERO,
      averagePrice: ZERO,
    }));
  }

  // This takes us from:
  //  <marketId1>,<outcome0>: [{timestamp: N,... }, {timestamp: M, ...}, ...]
  //  <marketId1>,<outcome1>: [{timestamp: N,... }, {timestamp: M, ...}, ...]
  //
  // to:
  // [
  //   [{timestamp: N, ...}, {timestamp: N, ...}],
  //   [{timestamp: M, ...}, {timestamp: M, ...}]
  // ]
  //
  //
  // This makes it easy to sum across the groups of timestamps
  const bucketsProfitLoss = _.zip(..._.values(outcomesProfitLoss));
  return bucketsProfitLoss.map((bucketProfitLoss: Array<ProfitLossResult>): ProfitLossResult => _.reduce(bucketProfitLoss, (left: ProfitLossResult, right: ProfitLossResult) => sumProfitLossResults(left, right))!);
}

export async function getProfitLossSummary(db: Knex, augur: Augur, params: GetProfitLossSummaryParamsType): Promise<NumericDictionary<ProfitLossResult>> {
  const endTime = params.endTime || getCurrentTime();

  const result: NumericDictionary<ProfitLossResult> = {};
  for (const days of [1, 30]) {
    const periodInterval = days * 60 * 60 * 24;
    const startTime = endTime - periodInterval;

    const [startProfit, endProfit, ...rest] = await getProfitLoss(db, augur, {
      universe: params.universe,
      account: params.account,
      marketId: params.marketId,
      startTime,
      endTime,
      periodInterval,
    });

    if (rest.length !== 0) throw new Error("PL calculation in summary returning more thant two bucket");

    const negativeStartProfit: ProfitLossResult = {
      timestamp: startProfit.timestamp,
      position: startProfit.position.multipliedBy(new BigNumber(-1)),
      realized: startProfit.realized.multipliedBy(new BigNumber(-1)),
      unrealized: startProfit.unrealized.multipliedBy(new BigNumber(-1)),
      total: startProfit.total.multipliedBy(new BigNumber(-1)),
      cost: startProfit.cost.multipliedBy(new BigNumber(-1)),
      averagePrice: startProfit.averagePrice,
    };

    result[days] = sumProfitLossResults(endProfit, negativeStartProfit);
  }

  return result;
}
