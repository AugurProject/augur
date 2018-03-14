import * as _ from "lodash";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, OrdersRow, OrderState, UIOrders } from "../../types";
import { queryModifier } from "./database";

interface OrdersRowWithCreationTime extends OrdersRow<BigNumber> {
  creationTime: number;
}

// market, outcome, creator, orderType, limit, sort
export function getOrders(db: Knex, universe: Address|null, marketId: Address|null, outcome: number|null, orderType: string|null, creator: Address|null, orderState: OrderState|null, earliestCreationTime: number|null, latestCreationTime: number|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null && marketId == null) return callback(new Error("Must provide universe, either via universe or marketId"));
  const queryData: {} = _.omitBy({
    universe,
    outcome,
    orderType,
    "orderCreator": creator,
    "orders.marketId": marketId,
  }, _.isNil);
  const query: Knex.QueryBuilder = db.select(["orders.*", "blocks.blockHash", `blocks.timestamp as creationTime`]).from("orders");
  query.leftJoin("blocks", "orders.blockNumber", "blocks.blockNumber");
  query.leftJoin("markets", "orders.marketId", "markets.marketId");
  query.where(queryData);
  if (earliestCreationTime != null) query.where("creationTime", ">=", earliestCreationTime);
  if (latestCreationTime != null) query.where("creationTime", "<=", latestCreationTime);
  query.whereNull("isRemoved");
  if ( orderState != null && orderState !== OrderState.ALL) query.where("orderState", orderState);
  queryModifier(query, "volume", "desc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err: Error|null, ordersRows?: Array<OrdersRowWithCreationTime>): void => {
    if (err) return callback(err);
    if (!ordersRows) return callback(new Error("Unexpected error fetching order rows"));
    const orders: UIOrders = {};
    ordersRows.forEach((row: OrdersRowWithCreationTime): void => {
      if (!orders[row.marketId]) orders[row.marketId] = {};
      if (!orders[row.marketId][row.outcome]) orders[row.marketId][row.outcome] = {};
      if (!orders[row.marketId][row.outcome][row.orderType]) orders[row.marketId][row.outcome][row.orderType] = {};
      orders[row.marketId][row.outcome][row.orderType][row.orderId!] = {
        orderId: row.orderId!,
        creationBlockNumber: row.blockNumber,
        transactionHash: row.transactionHash,
        logIndex: row.logIndex,
        shareToken: row.shareToken,
        owner: row.orderCreator,
        creationTime: row.creationTime,
        orderState: row.orderState,
        price: row.price.toFixed(),
        amount: row.amount.toFixed(),
        fullPrecisionPrice: row.fullPrecisionPrice.toFixed(),
        fullPrecisionAmount: row.fullPrecisionAmount.toFixed(),
        tokensEscrowed: row.tokensEscrowed.toFixed(),
        sharesEscrowed: row.sharesEscrowed.toFixed(),
      };
    });
    callback(null, orders);
  });
}
