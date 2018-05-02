import * as Knex from "knex";
import * as _ from "lodash";
import { Augur, CalculatedProfitLoss } from "augur.js";
import { Address, TradingHistoryRow, GenericCallback } from "../../types";
import { queryUserTradingHistory } from "./database";

export interface PLResult {
  timestamp: number;
  profitLoss: CalculatedProfitLoss|null;
};

const getPL = async function(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number): Promise<Array<PLResult>> {
  console.log(`Getting PL for ${startTime} to ${endTime}`);
  const trades: Array<TradingHistoryRow> = await queryUserTradingHistory(db, universe, account, null, null, null, null, endTime); 
  console.log(`Found ${trades.length} trades for account ${account}`);

  // Pre make the buckets so its easy to parition trades
  const bucketEndTimes: Array<number> = [];
  for(let bucketEnd=startTime; bucketEnd < endTime; bucketEnd += periodInterval) {
    bucketEndTimes.push(bucketEnd);
  }
  bucketEndTimes.push(endTime);

  console.log(bucketEndTimes);

  const [basis, ...profitLosses] = bucketEndTimes.map((bucketEndTime: number) => {
    // Get all the teades up to this endTime
    const bucket = _.filter(trades, (t: TradingHistoryRow) => t.timestamp <= bucketEndTime);
    return {
      timestamp: bucketEndTime,
      profitLoss: bucket.length == 0 ? null: augur.trading.calculateProfitLoss({ trades: bucket, lastPrice:  _.last(bucket)!.price })
    };
  });

  console.log(basis);
  console.log(profitLosses);

  return profitLosses; // Still need to adjust by "basis"
}

export function getProfitLoss(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number, callback: GenericCallback<Array<PLResult>>) {
  getPL(db, augur, universe, account, startTime, endTime, periodInterval).then((result) => callback(null, result)).catch(callback);
}
