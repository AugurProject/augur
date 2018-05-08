import * as Knex from "knex";
import * as _ from "lodash";
import BigNumber from "bignumber.js";
import { Augur, CalculatedProfitLoss } from "augur.js";
import { Address, TradingHistoryRow, GenericCallback } from "../../types";
import { queryUserTradingHistory } from "./database";

export interface PLResult {
  timestamp: number;
  profitLoss: CalculatedProfitLoss|null;
};

export interface PLBucket {
  endTime: number;
  lastPrice: string;
};

// Perhaps port this to Augur.js
export function calculateBucketedProfitLoss(augur: Augur, trades: Array<TradingHistoryRow>, buckets: Array<PLBuckets>, startTime: number, endTime: number, periodInterval: number) {
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
  const profitLosses = bucketEndTimes.map((bucketEndTime: number) => {
    // Get all the teades up to this endTime
    const bucket = _.filter(windowTrades, (t: TradingHistoryRow) => t.timestamp < bucketEndTime);
    console.log(`Bucket: ${bucketEndTime}`, bucket);
    return {
      timestamp: bucketEndTime,
      profitLoss: bucket.length == 0 ? null: augur.trading.calculateProfitLoss({
        trades: bucket,
        lastPrice:  _.last(bucket)!.price
      })
    };
  });


  return profitLosses;
}

export function getProfitLoss(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number, callback: GenericCallback<Array<PLResult>>) {
  console.log(`Getting PL for ${startTime} to ${endTime}`);
  // Pre make the buckets so its easy to parition trades
  const buckets: Array<Partial<PlBucket>> = [];
  for(let bucketEndTime=startTime + periodInterval; bucketEndTime < endTime; bucketEndTime += periodInterval) {
    buckets.push({
      endTime: bucketEndTime
    });
  }
  buckets.push({ endTime });


  try {
    queryUserTradingHistory(db, universe, account, null, null, null, null, endTime).orderBy("trades.marketId").orderBy("trades.outcome").asCallback((err, trades: Array<TradingHistoryRow>) => {
      if (err) return callback(err);

      var res = _
        .chain(trades)
        .groupBy((trade) => _.values(_.pick(trade, ["marketId", "outcome"])))
        .values()
        .map((trades: Array<TradingHistoryRow>, group: {marketId: string, outcome: number}) => Object.assign({}, group, calculateBucketedProfitLoss(augur, group.marketId, group.outcome, trades, startTime, endTime, periodInterval)))
        .value();

      console.log(res);
      callback(null);
    });
  } catch(e) {
    callback(e);
  }
}
