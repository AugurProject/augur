import { BigNumber } from "bignumber.js";
import * as Knex from "knex";
import { TradingHistoryRow, UITrade, SortLimitParams } from "../../types";
import { queryTradingHistoryParams } from "./database";
import Augur from "augur.js";
import * as t from "io-ts";

export const TradingHistoryParamsSpecific = t.type({
  universe: t.union([t.string, t.null, t.undefined]),
  account: t.union([t.string, t.null, t.undefined]),
  marketId: t.union([t.string, t.null, t.undefined]),
  outcome: t.union([t.number, t.null, t.undefined]),
  orderType: t.union([t.string, t.null, t.undefined]),
  ignoreSelfTrades: t.union([t.boolean, t.null, t.undefined]),
  earliestCreationTime: t.union([t.number, t.null, t.undefined]),
  latestCreationTime: t.union([t.number, t.null, t.undefined]),
});

export const TradingHistoryParams = t.intersection([
  TradingHistoryParamsSpecific,
  SortLimitParams,
]);

// Look up a user or market trading history. Must provide universe OR market. Outcome and orderType are optional parameters.
export async function getTradingHistory(db: Knex, augur: Augur, params: t.TypeOf<typeof TradingHistoryParams>): Promise<Array<UITrade>> {
  const userTradingHistory: Array<TradingHistoryRow> = await queryTradingHistoryParams(db, params);
  return userTradingHistory.map((trade: TradingHistoryRow): UITrade => {
    const tradeData = {
      transactionHash: trade.transactionHash,
      logIndex: trade.logIndex,
      orderId: trade.orderId,
      type: trade.orderType! === "buy" ? "sell" : "buy",
      price: trade.price!.toString(),
      amount: trade.amount!.toString(),
      maker: params.account == null ? null : params.account === trade.creator!,
      selfFilled: trade.creator === trade.filler,
      marketCreatorFees: trade.marketCreatorFees!.toString(),
      reporterFees: trade.reporterFees!.toString(),
      settlementFees: new BigNumber(trade.reporterFees!, 10).plus(new BigNumber(trade.marketCreatorFees!, 10)).toString(),
      marketId: trade.marketId!,
      outcome: trade.outcome!,
      shareToken: trade.shareToken!,
      timestamp: trade.timestamp!,
      tradeGroupId: trade.tradeGroupId!,
    };
    return tradeData;
  });
}
