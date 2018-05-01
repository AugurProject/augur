import * as Knex from "knex";
import * as _ from "lodash";
import Augur from "augur.js";
import { Address, TradingHistoryRow, GenericCallback } from "../../types";
import { queryUserTradingHistory } from "./database";

export interface PLResult {
  realized: string;
  unrealized: string;
};

const getPL = async function(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number): Promise<Array<PLResult>> {
  const trades: Array<TradingHistoryRow> = await queryUserTradingHistory(db, universe, account, null, null, null, endTime); 

  let bucketEndTime: number = startTime;
  const bucket: Array<TradingHistoryRow> = [];
  const [basis, ...profit_losses] = trades.reduce((memo: Array<any>, trade: TradingHistoryRow): Array<any> => {
    while(trade.timestamp >= bucketEndTime) {
      memo.push({
        timestamp: bucketEndTime,
        profit_loss: bucket.length === 0 ? null : augur.trading.calculateProfitLoss({ bucket , lastPrice: _.last(bucket)!.price!})
      });
      bucketEndTime += periodInterval;
    }
    bucket.push(trade);

    return memo;
  }, [] as Array<any>);

  return profit_loss; // Still need to adjust by "basis"
}

export function getProfitLoss(db: Knex, augur: Augur, universe: Address, account: Address, startTime: number, endTime: number, periodInterval: number, callback: GenericCallback<Array<PLResult>>) {
  getPL(db, augur, universe, account, startTime, endTime, periodInterval).then((result) => callback(null, result)).catch(callback);
}
