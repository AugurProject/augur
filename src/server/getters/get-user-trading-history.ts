import * as Knex from "knex";
import { Address, Bytes32, TradesRow, UITrade } from "../../types";
import { queryModifier } from "./database";

interface TradingHistoryRow extends TradesRow {
  timestamp: number;
}

// Look up a user's trading history. Should take market, outcome, and orderType as optional parameters.
export function getUserTradingHistory(db: Knex|Knex.Transaction, universe: Address|null, account: Address, marketID: Address|null|undefined, outcome: number|null|undefined, orderType: string|null|undefined, earliestCreationTime: number|null, latestCreationTime: number|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: Array<UITrade>) => void): void {
  if (universe == null && marketID == null ) return callback(new Error("Must provide reference to universe, specify universe or marketID"));
  const query = db.select([
    "trades.transactionHash",
    "trades.transactionIndex",
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
  ]).from("trades");
  query.leftJoin("blocks", "trades.blockNumber", "blocks.blockNumber");
  query.leftJoin("markets", "trades.marketID", "markets.marketID");
  query.where((builder) => {
    builder.where("trades.creator", account).orWhere("trades.filler", account);
  });
  if (universe != null) query.where("universe", universe);
  if (marketID != null) query.where("trades.marketID", marketID);
  if (outcome != null) query.where("trades.outcome", outcome);
  if (orderType != null) query.where("trades.orderType", orderType);
  if (earliestCreationTime != null) query.where("timestamp", ">=", earliestCreationTime);
  if (latestCreationTime != null) query.where("timestamp", "<=", latestCreationTime);
  queryModifier(query,  "trades.blockNumber", "desc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err: Error|null, userTradingHistory?: Array<TradingHistoryRow>): void => {
    if (err) return callback(err);
    if (!userTradingHistory) return callback(new Error("Internal error retrieving trade history"));
    callback(null, userTradingHistory.map((trade: TradingHistoryRow): UITrade => ({
      transactionHash: trade.transactionHash,
      transactionIndex: trade.transactionIndex,
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
