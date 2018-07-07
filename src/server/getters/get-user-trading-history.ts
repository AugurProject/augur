import { BigNumber } from "bignumber.js";
import * as Knex from "knex";
import { Address, TradingHistoryRow, UITrade, GenericCallback } from "../../types";
import { queryTradingHistory } from "./database";

// Look up a user's trading history. Should take market, outcome, and orderType as optional parameters.
export function getUserTradingHistory(db: Knex|Knex.Transaction, universe: Address|null, account: Address, marketId: Address|null, outcome: number|null, orderType: string|null, earliestCreationTime: number|null, latestCreationTime: number|null, sortBy: string|null, isSortDescending: boolean|null, limit: number|null, offset: number|null, ignoreSelfTrades: boolean|null, callback: GenericCallback<Array<UITrade>>): void {
  queryTradingHistory(db, universe, account, marketId, outcome, orderType, earliestCreationTime, latestCreationTime, sortBy, isSortDescending, limit, offset, ignoreSelfTrades, (err: Error | null, userTradingHistory?: Array<TradingHistoryRow>): void => {
    if (err) return callback(err);
    if (!userTradingHistory) return callback(new Error("Internal error retrieving trade history"));
    callback(null, userTradingHistory.map((trade: TradingHistoryRow): UITrade => ({
      transactionHash: trade.transactionHash,
      logIndex: trade.logIndex,
      orderId: trade.orderId,
      type: trade.orderType! === "buy" ? "sell" : "buy",
      price: new BigNumber(trade.price!, 10).toFixed(),
      amount: new BigNumber(trade.amount!, 10).toFixed(),
      maker: account === trade.creator!,
      selfFilled: trade.creator === trade.filler,
      marketCreatorFees: new BigNumber(trade.marketCreatorFees!, 10).toFixed(),
      reporterFees: new BigNumber(trade.reporterFees!, 10).toFixed(),
      settlementFees: new BigNumber(trade.reporterFees!, 10).plus(new BigNumber(trade.marketCreatorFees!, 10)).toFixed(),
      marketId: trade.marketId!,
      outcome: trade.outcome!,
      shareToken: trade.shareToken!,
      timestamp: trade.timestamp!,
      tradeGroupId: trade.tradeGroupId!,
    })));
  });
}
