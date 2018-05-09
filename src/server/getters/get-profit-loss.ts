import * as Knex from "knex";
import * as _ from "lodash";
import { mapValues } from "async";
import BigNumber from "bignumber.js";
import { Augur, CalculatedProfitLoss } from "augur.js";
import { Address, TradingHistoryRow, GenericCallback, AsyncCallback } from "../../types";
import { queryTradingHistory } from "./database";

export interface PLBucket {
  timestamp: number;
  lastPrice?: string;
  profitLoss?: Record<"position" | "meanOpenPrice" | "realized" | "unrealized", string> | CalculatedProfitLoss | null;
};

export function calculateBucketProfitLoss(augur: Augur, trades: Array<TradingHistoryRow>, buckets: Array<PLBucket>): Array<PLBucket> {
  if (buckets == null) throw new Error("Buckets are required");
  if (typeof buckets.map === "undefined") throw new Error(`buckets must be an array, got ${buckets}`);

  const [basisPL, ...windowPLs] = buckets.map((bucket: PLBucket) => {
    if (bucket.lastPrice == null) return bucket;

    const bucketTrades = _.filter(trades, (t: TradingHistoryRow) => t.timestamp < bucket.timestamp);
    return Object.assign({}, bucket, {
      profitLoss: augur.trading.calculateProfitLoss({
        trades: bucketTrades,
        lastPrice:  bucket.lastPrice,
      })
    });
  });

  if (basisPL.profitLoss != null && windowPLs.length > 0) {
    return windowPLs.map((pl) => {
      if (pl.profitLoss == null) return pl;
      return Object.assign({}, pl, {
        realized: new BigNumber(pl.profitLoss.realized).minus(new BigNumber(basisPL.profitLoss!.realized)).toFixed(),
        unrealized: new BigNumber(pl.profitLoss.unrealized).minus(new BigNumber(basisPL.profitLoss!.unrealized)).toFixed(),
      });
    });
  }

  return windowPLs;
}

export function bucketRangeByInterval(startTime: number, endTime: number, periodInterval: number): Array<PLBucket> {
  if (startTime < 0) throw new Error("startTime must be a valid unix timestamp, greater than 0");
  if (endTime < 0) throw new Error("endTime must be a valid unix timestamp, greater than 0");
  if (endTime <= startTime) throw new Error("endTime must be greater than startTime");
  if (periodInterval <= 0) throw new Error("periodInterval must be positive integer (seconds)");

  const buckets: Array<PLBucket> = [];
  for(let bucketEndTime=startTime; bucketEndTime < endTime; bucketEndTime += periodInterval) {
    buckets.push({ timestamp: bucketEndTime, profitLoss: null });
  }
  buckets.push({ timestamp: endTime, profitLoss: null });

  return buckets;
}

export const getBucketLastTradePrices = async (db: Knex, universe: string, marketId: string, outcome: number, endTime: number, buckets: Array<PLBucket>): Promise<Array<PLBucket>> => {
  const outcomeTrades: Array<Partial<TradingHistoryRow>> = await queryTradingHistory(db, universe, null, marketId, outcome, null, null, endTime);

  const bucketsWithLastPrice = buckets.map((bucket: PLBucket) => {
    // This insertion point will give us the place in the sorted "outcomeTrades" array
    // where out bucket can go without changing the sort order, which means that one entry
    // before that location is the "last trade" in that window.
    //
    // If the insertPoint is zero, then we don't have any "lastPrice" value -- e.g. there are
    // no trades in that point which will result in a `null` PL.
    const insertPoint: number = _.sortedIndexBy(outcomeTrades, { timestamp: bucket.timestamp}, (trade) => trade.timestamp);
    if (insertPoint > 0) {
      return Object.assign({}, bucket, {lastPrice: outcomeTrades[insertPoint - 1].price!.toFixed()});
    }

    return bucket;
  });
  return bucketsWithLastPrice;
}

function groupOutcomesProfitLossByBucket(results: any) {
  return _.zip(... _.values(results));
}

function sumProfitLossResults(left: PLBucket, right: PLBucket): PLBucket {
  if (left == null) return right;
  if (left.profitLoss == null) return right;
  if (right.profitLoss == null) return left;

  const leftAveragePrice = new BigNumber(left.profitLoss.meanOpenPrice, 10);
  const leftPosition = new BigNumber(left.profitLoss.position, 10);
  const leftRealized = new BigNumber(left.profitLoss.realized, 10);
  const leftUnrealized = new BigNumber(left.profitLoss.unrealized, 10);

  const rightAveragePrice = new BigNumber(right.profitLoss.meanOpenPrice, 10);
  const rightPosition = new BigNumber(right.profitLoss.position, 10);
  const rightRealized = new BigNumber(right.profitLoss.realized, 10);
  const rightUnrealized = new BigNumber(right.profitLoss.unrealized, 10);

  const totalPosition = leftPosition.plus(rightPosition);
  return {
    timestamp: left.timestamp,
    profitLoss: {
      meanOpenPrice: (leftAveragePrice.times(leftPosition).plus(rightAveragePrice.times(rightPosition))).dividedBy(totalPosition).toFixed(),
      position: totalPosition.toFixed(),
      realized: leftRealized.plus(rightRealized).toFixed(),
      unrealized: leftUnrealized.plus(rightUnrealized).toFixed(),
    }
  };
}

async function getPL(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number): Promise<Array<PLBucket>> {
  // Bucket the time range into periods of `periodInterval`
  const buckets = bucketRangeByInterval(startTime, endTime, periodInterval);

  // get all the trades for this user from the beginning of time, until
  // `endTime`
  const trades: Array<TradingHistoryRow> = await queryTradingHistory(db, universe, account, null, null, null, null, endTime).orderBy("trades.marketId").orderBy("trades.outcome");

  // group these trades by their market & outcome, so we can process each
  // separately
  const tradesByOutcome = _.groupBy(trades, (trade) => _.values(_.pick(trade, ["marketId", "outcome"])));

  if (_.isEmpty(tradesByOutcome)) return buckets.slice(1);

  // For each group, gather the last trade prices for each bucket, and
  // calculate each bucket's profit and loss
  const results = await Promise.all(_.map(tradesByOutcome, async (trades: Array<TradingHistoryRow>, key: string): Promise<Array<PLBucket>> => {
    const [marketId, outcome] = key.split(",");
    const bucketsWithLastPrice: Array<PLBucket> = await getBucketLastTradePrices(db, universe, marketId, parseInt(outcome), endTime, buckets);
    return calculateBucketProfitLoss(augur, trades, bucketsWithLastPrice);
  }));

  console.log("results: ", results);

  // We have results! Drop the market & outcome groups, and then re-group by
  // bucket timestamp, and aggregate all of the PLBuckets by bucket
  const summed = groupOutcomesProfitLossByBucket(results).map((bucket: Array<PLBucket>) => {
    return bucket.reduce(sumProfitLossResults, {timestamp: 0, profitLoss: null});
  });

  console.log("Summed: ", summed);
  return summed;
}

export function getProfitLoss(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number, callback: GenericCallback<Array<PLBucket>>) {
  console.log(`Getting PL for ${startTime} to ${endTime}`);
  try {
    getPL(db, augur, universe, account, startTime, endTime, periodInterval).then((results: Array<PLBucket>) => callback(null, results)).catch(callback);
  } catch(e) {
    callback(e);
  }
}
