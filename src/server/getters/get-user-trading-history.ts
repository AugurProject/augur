import * as Knex from "knex";
import { Address, TradingHistoryTradesRow, UITrade } from "../../types";
import { sortDirection } from "../../utils/sort-direction";

// Look up a user's trading history. Should take market, outcome, and orderType as optional parameters. In addition to the "normal" trade data (i.e., the stuff stored in the OrderFilled log on-chain), the response should include the user's position after the trade, in both "raw" and "adjusted-for-user-intention" formats -- the latter meaning that short positions are shown as negative, rather than as positive positions in the other outcomes), realized and unrealized profit/loss, and max possible gain/loss (at market resolution).
export function getUserTradingHistory(db: Knex, account: Address, marketID: Address|null|undefined, outcome: number|null|undefined, orderType: string|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err?: Error|null, result?: any) => void): void {
  const columnsToSelect: Array<string> = ["market_id", "outcome", "order_type", "price", "shares", "creator", "share_token", "trade_block_number"];
  const selectWhereParams: any = { account };
  if (marketID != null) selectWhereParams.marketID = marketID;
  if (outcome != null) selectWhereParams.outcome = outcome;
  if (orderType != null) selectWhereParams.orderType = orderType;
  let query: Knex.QueryBuilder = db.select().from("trades").where(selectWhereParams).orderBy(sortBy || "trade_block_number", sortDirection(isSortDescending, "desc"));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  console.log("getUserTradingHistory:", query.toSQL());
  query.asCallback((err?: Error|null, userTradingHistory?: Array<TradingHistoryTradesRow>): void => {
    console.log("userTradingHistory:", userTradingHistory);
    if (err) return callback(err);
    if (!userTradingHistory || !userTradingHistory.length) return callback(null);
    callback(null, userTradingHistory.map((trade: TradingHistoryTradesRow) => ({
      type: trade.order_type,
      price: trade.price,
      shares: trade.shares,
      maker: account === trade.creator
    })));
  });
}
