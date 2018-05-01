import * as Knex from "knex";
import * as _ from "lodash";
import { Augur, CalculatedProfitLoss } from "augur.js";
import { Address, TradingHistoryRow, GenericCallback } from "../../types";
import { queryUserTradingHistory } from "./database";

export interface PLResult {
  timestamp: number;
  profit_loss: CalculatedProfitLoss|null;
};

const getPL = async function(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number): Promise<Array<PLResult>> {
  const trades: Array<TradingHistoryRow> = await queryUserTradingHistory(db, universe, account, null, null, null, endTime); 

  let bucketEndTime: number = startTime;
  const bucket: Array<TradingHistoryRow> = [];
  const [basis, ...profit_losses] = trades.reduce((memo: Array<PLResult>, trade: TradingHistoryRow): Array<PLResult> => {
    let profit_loss: CalculatedProfitLoss|null = null;
    while(trade.timestamp >= bucketEndTime) {
      // Only calculate the PL once and if subsquent groups wont have this trade, re-use the result
      if (profit_loss === null && bucket.length > 0) {
        profit_loss = augur.trading.calculateProfitLoss({ bucket , lastPrice: _.last(bucket)!.price!});
      }

      memo.push({ profit_loss, timestamp: bucketEndTime } );
      bucketEndTime += periodInterval;
    }

    bucket.push(trade);

    return memo;
  }, [] as Array<PLResult>);

  return profit_losses; // Still need to adjust by "basis"
}

export function getProfitLoss(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number, callback: GenericCallback<Array<PLResult>>) {
  getPL(db, augur, universe, account, startTime, endTime, periodInterval).then((result) => callback(null, result)).catch(callback);
}
