import * as Knex from "knex";
import * as _ from "lodash";
import BigNumber from "bignumber.js";
import { Augur } from "augur.js";
import { Address, TradingHistoryRow, GenericCallback } from "../../types";
import { queryTradingHistory } from "./database";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

const DEFAULT_NUMBER_OF_BUCKETS = 30;
// Make the math tolerable until we have a chance to fix the BN->Stringness in augur.js
function add(n1: string, n2: string) {
  return new BigNumber(n1, 10).plus(new BigNumber(n2));
}

function sub(n1: string, n2: string) {
  return new BigNumber(n1, 10).minus(new BigNumber(n2));
}

export type ProfitLoss = Record<"position" | "meanOpenPrice" | "realized" | "unrealized" | "total", string>;
export interface PLBucket {
  timestamp: number;
  lastPrice?: string;
  profitLoss?: ProfitLoss | null;
}

export type TradeRow = TradingHistoryRow & { type: string; maker: boolean };

export function calculateBucketProfitLoss(augur: Augur, trades: Array<TradeRow>, buckets: Array<PLBucket>): Array<PLBucket> {
  if (buckets == null) throw new Error("Buckets are required");
  if (typeof buckets.map === "undefined") throw new Error(`buckets must be an array, got ${buckets}`);

  const [basisPL, ...windowPLs] = buckets.map((bucket: PLBucket) => {
    if (bucket.lastPrice == null) return bucket;

    const bucketTrades = _.filter(trades, (t: TradeRow) => t.timestamp < bucket.timestamp);
    const profitLoss = augur.trading.calculateProfitLoss({ trades: bucketTrades, lastPrice: bucket.lastPrice });
    return Object.assign({}, bucket, { profitLoss });
  });

  if (basisPL.profitLoss != null && windowPLs.length > 0) {
    return windowPLs.map((pl) => {
      if (pl.profitLoss == null) return pl;
      const profitLoss = Object.assign({}, pl.profitLoss, {
        realized: sub(pl.profitLoss.realized, basisPL.profitLoss!.realized).toFixed(),
        total: sub(pl.profitLoss.total, basisPL.profitLoss!.total).toFixed(),
        unrealized: sub(pl.profitLoss.unrealized, basisPL.profitLoss!.unrealized).toFixed(),
      });
      return Object.assign({}, pl, { profitLoss });
    });
  }

  return windowPLs;
}

export function bucketRangeByInterval(startTime: number, endTime: number, periodInterval: number | null): Array<PLBucket> {
  if (startTime < 0) throw new Error("startTime must be a valid unix timestamp, greater than 0");
  if (endTime < 0) throw new Error("endTime must be a valid unix timestamp, greater than 0");
  if (endTime <= startTime) throw new Error("endTime must be greater than startTime");
  if (periodInterval !== null && periodInterval <= 0) throw new Error("periodInterval must be positive integer (seconds)");

  const interval = periodInterval == null ? Math.ceil((endTime - startTime) / DEFAULT_NUMBER_OF_BUCKETS) : periodInterval;

  const buckets: Array<PLBucket> = [];
  for (let bucketEndTime = startTime; bucketEndTime < endTime; bucketEndTime += interval) {
    buckets.push({ timestamp: bucketEndTime, profitLoss: null });
  }
  buckets.push({ timestamp: endTime, profitLoss: null });

  return buckets;
}

async function getBucketLastTradePrices(db: Knex, universe: Address, marketId: Address, outcome: number, endTime: number, buckets: Array<PLBucket>): Promise<Array<PLBucket>> {
  const outcomeTrades: Array<Partial<TradingHistoryRow>> = await queryTradingHistory(db, universe, null, marketId, outcome, null, null, endTime, "trades.blockNumber", false);

  return buckets.map((bucket: PLBucket) => {
    // This insertion point will give us the place in the sorted "outcomeTrades" array
    // where out bucket can go without changing the sort order, which means that one entry
    // before that location is the "last trade" in that window.
    //
    // If the insertPoint is zero, then we don't have any "lastPrice" value -- e.g. there are
    // no trades in that point which will result in a `null` PL.
    const insertPoint: number = _.sortedIndexBy(outcomeTrades, { timestamp: bucket.timestamp }, (trade) => trade.timestamp);
    if (insertPoint > 0) {
      return Object.assign({}, bucket, { lastPrice: outcomeTrades[insertPoint - 1].price!.toFixed() });
    }

    return bucket;
  });
}

function groupOutcomesProfitLossByBucket(results: any) {
  return _.zip(..._.values(results));
}

function sumProfitLossResults(left: PLBucket, right: PLBucket): PLBucket {
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

async function getPL(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number | null): Promise<Array<PLBucket>> {
  // get all the trades for this user from the beginning of time, until
  // `endTime`
  const tradeHistory: Array<TradingHistoryRow> = await queryTradingHistory(db, universe, account, null, null, null, null, endTime, "trades.blockNumber", false)
    .orderBy("trades.marketId")
    .orderBy("trades.outcome");

  const trades: Array<TradeRow> = tradeHistory.map((trade: TradingHistoryRow): TradeRow => {
    return Object.assign({}, trade, {
      type: trade.orderType! === "buy" ? "sell" : "buy",
      maker: account === trade.creator!,
    });
  }) as Array<TradeRow>;

  if (trades.length === 0) return bucketRangeByInterval(startTime, endTime, periodInterval).slice(1);

  const buckets = bucketRangeByInterval(startTime || trades[0].timestamp, endTime, periodInterval);

  // group these trades by their market & outcome, so we can process each
  // separately
  const tradesByOutcome = _.groupBy(trades, (trade) => _.values(_.pick(trade, ["marketId", "outcome"])));

  // For each group, gather the last trade prices for each bucket, and
  // calculate each bucket's profit and loss
  const results = await Promise.all(
    _.map(tradesByOutcome, async (trades: Array<TradeRow>, key: string): Promise<Array<PLBucket>> => {
      const [marketId, outcome] = key.split(",");
      const bucketsWithLastPrice: Array<PLBucket> = await getBucketLastTradePrices(db, universe, marketId, parseInt(outcome, 10), endTime, buckets);
      return calculateBucketProfitLoss(augur, trades, bucketsWithLastPrice);
    }),
  );

  // We have results! Drop the market & outcome groups, and then re-group by
  // bucket timestamp, and aggregate all of the PLBuckets by bucket
  return groupOutcomesProfitLossByBucket(results).map((bucket: Array<PLBucket>) => {
    return bucket.reduce(sumProfitLossResults, { timestamp: 0, profitLoss: null });
  });
}

export function getProfitLoss(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number | null, callback: GenericCallback<Array<PLBucket>>) {
  try {
    if (typeof universe !== "string") throw new Error("Universe Address Required");
    if (typeof account !== "string") throw new Error("Account Address Required");

    getPL(db, augur, universe.toLowerCase(), account.toLowerCase(), startTime, endTime, periodInterval)
      .then((results: Array<PLBucket>) => callback(null, results))
      .catch(callback);
  } catch (e) {
    callback(e);
  }
}
