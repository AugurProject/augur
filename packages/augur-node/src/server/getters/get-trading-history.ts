import { BigNumber } from "bignumber.js";
import * as Knex from "knex";
import { Address, TradingHistoryRow, UITrade, GenericCallback } from "../../types";
import { queryTradingHistory } from "./database";

// Look up a user or market trading history. Must provide universe OR market. Outcome and orderType are optional parameters.
export function getTradingHistory(db: Knex|Knex.Transaction, universe: Address|null, account: Address, marketId: Address|null, outcome: number|null, orderType: string|null, earliestCreationTime: number|null, latestCreationTime: number|null, sortBy: string|null, isSortDescending: boolean|null, limit: number|null, offset: number|null, ignoreSelfTrades: boolean|null, callback: GenericCallback<Array<UITrade>>): void {
  queryTradingHistory(db, universe, account, marketId, outcome, orderType, earliestCreationTime, latestCreationTime, sortBy, isSortDescending, limit, offset, ignoreSelfTrades, (err: Error|null, userTradingHistory?: Array<TradingHistoryRow>): void => {
    if (err) return callback(err);
    if (!userTradingHistory) return callback(new Error("Internal error retrieving trade history"));
    callback(null, userTradingHistory.map((trade: TradingHistoryRow): UITrade => {
      const tradeData = {
        transactionHash: trade.transactionHash,
        logIndex: trade.logIndex,
        orderId: trade.orderId,
        type: trade.orderType! === "buy" ? "sell" : "buy",
        price: trade.price!.toFixed(),
        amount: trade.amount!.toFixed(),
        maker: account == null ? null : account === trade.creator!,
        selfFilled: trade.creator === trade.filler,
        marketCreatorFees: trade.marketCreatorFees!.toFixed(),
        reporterFees: trade.reporterFees!.toFixed(),
        settlementFees: new BigNumber(trade.reporterFees!, 10).plus(new BigNumber(trade.marketCreatorFees!, 10)).toFixed(),
        marketId: trade.marketId!,
        outcome: trade.outcome!,
        shareToken: trade.shareToken!,
        timestamp: trade.timestamp!,
        tradeGroupId: trade.tradeGroupId!,
      };
      return Object.assign( tradeData);
    }));
  });
}
