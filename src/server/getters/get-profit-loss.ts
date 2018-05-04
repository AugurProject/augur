import * as Knex from "knex";
import * as _ from "lodash";
import { Augur, CalculatedProfitLoss } from "augur.js";
import { Address, TradingHistoryRow, GenericCallback } from "../../types";
import { queryUserTradingHistory } from "./database";

export interface PLResult {
  timestamp: number;
  profitLoss: CalculatedProfitLoss|null;
};

// Perhaps port this to Augur.js
export function calculateBucketedProfitLoss(augur: Augur, trades: Array<TradingHistoryRow>, startTime: number, endTime: number, periodInterval: number) {
  // Pre make the buckets so its easy to parition trades
  const bucketEndTimes: Array<number> = [];
  for(let bucketEnd=startTime; bucketEnd < endTime; bucketEnd += periodInterval) {
    bucketEndTimes.push(bucketEnd);
  }
  bucketEndTimes.push(endTime);

  const [basis, ...profitLosses] = bucketEndTimes.map((bucketEndTime: number) => {
    // Get all the teades up to this endTime
    const bucket = _.filter(trades, (t: TradingHistoryRow) => t.timestamp <= bucketEndTime);
    return {
      timestamp: bucketEndTime,
      profitLoss: bucket.length == 0 ? null: augur.trading.calculateProfitLoss({ trades: bucket, lastPrice:  _.last(bucket)!.price })
    };
  });

  return profitLosses; // Still need to adjust by "basis"
}

export function getProfitLoss(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number, callback: GenericCallback<Array<PLResult>>) {
  console.log(`Getting PL for ${startTime} to ${endTime}`);
  try {
    queryUserTradingHistory(db, universe, account, null, null, null, null, endTime).asCallback((err, trades: Array<TradingHistoryRow>) => {
      if (err) return callback(err);

      callback(null, calculateBucketedProfitLoss(augur, trades, startTime, endTime, periodInterval));
    });
  } catch(e) {
    callback(e);
  }
}
