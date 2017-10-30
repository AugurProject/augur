import * as Knex from "knex";
import { Address, Bytes32, TradesRow, UITrade } from "../../types";
import { queryModifier } from "./database";

interface TradingHistoryRow extends Partial<TradesRow> {
  timestamp: number;
}

// Look up a user's trading history. Should take market, outcome, and orderType as optional parameters.
export function getUserTradingHistory(db: Knex|Knex.Transaction, account: Address, marketID: Address|null|undefined, outcome: number|null|undefined, orderType: string|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: Array<UITrade>) => void): void {
  let query = db.select([
    "trades.marketID",
    "trades.outcome",
    "trades.orderType",
    "trades.price",
    "trades.amount",
    "trades.creator",
    "trades.shareToken",
    "trades.blockNumber",
    "trades.settlementFees",
    "trades.tradeGroupID",
    "blocks.timestamp",
  ]).from("trades").leftJoin("blocks", "trades.blockNumber", "blocks.blockNumber").where("trades.creator", account).orWhere("trades.filler", account);
  if (marketID != null) query = query.andWhere("trades.marketID", marketID);
  if (outcome != null) query = query.andWhere("trades.outcome", outcome);
  if (orderType != null) query = query.andWhere("trades.orderType", orderType);
  query = queryModifier(query,  "trades.blockNumber", "desc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err: Error|null, userTradingHistory?: Array<TradingHistoryRow>): void => {
    if (err) return callback(err);
    if (!userTradingHistory || !userTradingHistory.length) return callback(null);
    callback(null, userTradingHistory.map((trade: TradingHistoryRow): UITrade => ({
      type: trade.orderType!,
      price: trade.price!,
      amount: trade.amount!,
      maker: account === trade.creator!,
      settlementFees: trade.settlementFees!,
      marketID: trade.marketID!,
      outcome: trade.outcome!,
      shareToken: trade.shareToken!,
      timestamp: trade.timestamp!,
      tradeGroupID: trade.tradeGroupID!,
    })));
  });
}
