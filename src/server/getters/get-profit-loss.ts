import * as Knex from "knex";
import * as _ from "lodash";
import { mapValues } from "async";
import BigNumber from "bignumber.js";
import { Augur, CalculatedProfitLoss } from "augur.js";
import { Address, TradingHistoryRow, GenericCallback, AsyncCallback } from "../../types";
import { queryTradingHistory } from "./database";

export interface PLResult {
  timestamp: number;
  profitLoss: Record<"position" | "meanOpenPrice" | "realized" | "unrealized", string> | CalculatedProfitLoss | null;
};

export interface PLBucket {
  endTime: number;
  lastPrice: BigNumber;
};

// Perhaps port this to Augur.js
export function calculateBucketedProfitLoss(augur: Augur, trades: Array<TradingHistoryRow>, buckets: Array<PLBucket>, startTime: number, endTime: number, periodInterval: number) {
  if (startTime < 0) throw new Error("startTime must be a valid unix timestamp, greater than 0");
  if (endTime < 0) throw new Error("endTime must be a valid unix timestamp, greater than 0");
  if (endTime <= startTime) throw new Error("endTime must be greater than startTime");
  if (periodInterval <= 0) throw new Error("periodInterval must be positive integer (seconds)");

  const [basisTrades, windowTrades] = _.partition(trades, (t: TradingHistoryRow) => t.timestamp < startTime);

  // Calculate the basis. This will give us the meanOpenPrice which we can use to 
  // move the zero-point of the unrealized P/L calculation while calculating the P/L for
  // the buckets
  var basis: CalculatedProfitLoss|null = null;
  if (basisTrades.length > 0) {
    basis = augur.trading.calculateProfitLoss({ trades: basisTrades, lastPrice: _.last(basisTrades)!.price });
  }

  console.log("Basis: ", basis);
  console.log("Trades: ", windowTrades);
  const profitLosses = buckets.map((bucket: PLBucket) => {
    if (bucket.lastPrice == null) return { timestamp: bucket.endTime, profitLoss: null };
    // Get all the teades up to this endTime
    const bucketTrades = _.filter(windowTrades, (t: TradingHistoryRow) => t.timestamp < bucket.endTime);
    console.log(`Bucket: ${bucket.endTime} with last price ${bucket.lastPrice.toFixed()}, trades: `, bucketTrades);
    return {
      timestamp: bucket.endTime,
      profitLoss: bucketTrades.length == 0 ? null: augur.trading.calculateProfitLoss({
        trades: bucketTrades,
        lastPrice:  bucket.lastPrice,
      })
    };
  });


  return profitLosses;
}

export function getProfitLoss(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number, callback: GenericCallback<Array<PLResult>>) {
  console.log(`Getting PL for ${startTime} to ${endTime}`);
  // Pre make the buckets so its easy to parition trades
  const buckets: Array<Partial<PLBucket>> = [];
  for(let bucketEndTime=startTime + periodInterval; bucketEndTime < endTime; bucketEndTime += periodInterval) {
    buckets.push({
      endTime: bucketEndTime
    });
  }
  buckets.push({ endTime });


  try {
    queryTradingHistory(db, universe, account, null, null, null, null, endTime).orderBy("trades.marketId").orderBy("trades.outcome").asCallback((err: Error|null, trades: Array<TradingHistoryRow>) => {
      if (err) return callback(err);

      const groups = _.groupBy(trades, (trade) => _.values(_.pick(trade, ["marketId", "outcome"])));

      mapValues(groups, (trades: Array<TradingHistoryRow>, key: string, callback: AsyncCallback) => {
        const [marketId, outcome] = key.split(",");
        try {
          queryTradingHistory(db, universe, null, marketId, parseInt(outcome), null, null, endTime).asCallback((err: Error|null, outcomeTrades: Array<Partial<TradingHistoryRow>>) => {
            if (err) return callback(err);

            const bucketsWithLastPrice = buckets.map((bucket: PLBucket) => {
              // This insertion point will give us the place in the sorted "outcomeTrades" array
              // where out bucket can go without changing the sort order, which means that one entry
              // before that location is the "last trade" in that window.
              //
              // If the insertPoint is zero, then we don't have any "lastPrice" value -- e.g. there are
              // no trades in that point which will result in a `null` PL.
              const insertPoint: number = _.sortedIndexBy(outcomeTrades, { timestamp: bucket.endTime}, (trade) => trade.timestamp);
              if (insertPoint > 0) {
                return Object.assign({}, bucket, {lastPrice: outcomeTrades[insertPoint - 1].price});
              }

              return bucket;
            });
            callback(null, calculateBucketedProfitLoss(augur, trades, bucketsWithLastPrice, startTime, endTime, periodInterval));
          });
        } catch(e) {
          callback(e, null);
        }
      }, (err: Error, results: any) => {
        // Need to sum across the groups here
        console.log("Results: ", results);
        const values = _.values(results);
        const summed = _.zip(...values).map((bucket: Array<PLResult>) => {
          return bucket.reduce((memo: PLResult, value: PLResult) => {
            if (memo == null) return value;
            if (memo.profitLoss == null) return value;
            if (value.profitLoss == null) return memo;

            const memoAveragePrice = new BigNumber(memo.profitLoss.meanOpenPrice, 10);
            const memoPosition = new BigNumber(memo.profitLoss.position, 10);
            const memoRealized = new BigNumber(memo.profitLoss.realized, 10);
            const memoUnrealized = new BigNumber(memo.profitLoss.unrealized, 10);

            const valueAveragePrice = new BigNumber(value.profitLoss.meanOpenPrice, 10);
            const valuePosition = new BigNumber(value.profitLoss.position, 10);
            const valueRealized = new BigNumber(value.profitLoss.realized, 10);
            const valueUnrealized = new BigNumber(value.profitLoss.unrealized, 10);

            const totalPosition = memoPosition.plus(valuePosition);
            return {
              timestamp: memo.timestamp,
              profitLoss: {
                meanOpenPrice: (memoAveragePrice.times(memoPosition).plus(valueAveragePrice.times(valuePosition))).dividedBy(totalPosition).toFixed(),
                position: totalPosition.toFixed(),
                realized: memoRealized.plus(valueRealized).toFixed(),
                unrealized: memoUnrealized.plus(valueUnrealized).toFixed(),
              }
            };
          }, {timestamp: 0, profitLoss: null});
        });
        console.log("Summed: ", summed);
        callback(err, summed!);
      });
    });
  } catch(e) {
    callback(e);
  }
}
