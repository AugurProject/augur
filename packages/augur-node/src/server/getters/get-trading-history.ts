import * as t from "io-ts";
import Knex from "knex";
import * as _ from "lodash";
import { Augur, BigNumber, OutcomeParam, SortLimitParams, TradingHistoryRow, UITrade } from "../../types";

import { queryTradingHistoryParams } from "./database";

export const TradingHistoryParamsSpecific = t.type({
  universe: t.union([t.string, t.null, t.undefined]),
  account: t.union([t.string, t.null, t.undefined]),
  marketId: t.union([t.string, t.null, t.undefined]),
  outcome: t.union([OutcomeParam, t.number, t.null, t.undefined]),
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
    return Object.assign(_.pick(trade, [
      "transactionHash",
      "logIndex",
      "orderId",
      "filler",
      "creator",
      "marketId",
      "outcome",
      "shareToken",
      "timestamp",
      "tradeGroupId",
    ]), {
      type: trade.orderType === "buy" ? "sell" : "buy",
      price: trade.price.toString(),
      amount: trade.amount.toString(),
      maker: params.account == null ? null : params.account === trade.creator,
      selfFilled: trade.creator === trade.filler,
      marketCreatorFees: trade.marketCreatorFees.toString(),
      reporterFees: trade.reporterFees.toString(),
      settlementFees: new BigNumber(trade.reporterFees.toString()).plus(new BigNumber(trade.marketCreatorFees.toString())).toString(),
    });
  });
}
