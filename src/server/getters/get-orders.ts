import * as _ from "lodash";
import * as Knex from "knex";
import { Address, Bytes32, Order, OrdersRow, OrderState } from "../../types";
import { queryModifier } from "./database";

interface Orders {
  [marketID: string]: {
    [outcome: number]: {
      [orderType: string]: {
        [orderID: string]: Order;
      };
    };
  };
}

interface OrdersRowWithCreationTime extends OrdersRow {
  creationTime: number;
}

// market, outcome, creator, orderType, limit, sort
export function getOrders(db: Knex, universe: Address|null, marketID: Address|null, outcome: number|null, orderType: string|null, creator: Address|null, orderState: OrderState|null, earliestCreationTime: number|null, latestCreationTime: number|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null && marketID == null) return callback(new Error("Must provide universe, either via universe or marketID"));
  const queryData: {} = _.omitBy({
    universe,
    outcome,
    orderType,
    "orderCreator": creator,
    "orders.marketID": marketID,
  }, _.isNil);
  const query: Knex.QueryBuilder = db.select(["orders.*", `blocks.timestamp as creationTime`]).from("orders");
  query.leftJoin("blocks", "orders.blockNumber", "blocks.blockNumber");
  query.leftJoin("markets", "orders.marketID", "markets.marketID");
  query.where(queryData);
  if (earliestCreationTime != null) query.where("creationTime", ">", earliestCreationTime);
  if (latestCreationTime != null) query.where("creationTime", "<", latestCreationTime);
  if ( orderState != null && orderState !== OrderState.ALL) query.where("orderState", orderState);
  queryModifier(query, "volume", "desc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err: Error|null, ordersRows?: Array<OrdersRowWithCreationTime>): void => {
    if (err) return callback(err);
    if (!ordersRows) return callback(new Error("Unexpected error fetching order rows"));
    const orders: Orders = {};
    ordersRows.forEach((row: OrdersRowWithCreationTime): void => {
      if (!orders[row.marketID]) orders[row.marketID] = {};
      if (!orders[row.marketID][row.outcome]) orders[row.marketID][row.outcome] = {};
      if (!orders[row.marketID][row.outcome][row.orderType]) orders[row.marketID][row.outcome][row.orderType] = {};
      orders[row.marketID][row.outcome][row.orderType][row.orderID!] = {
        creationBlockNumber: row.blockNumber,
        transactionHash: row.transactionHash,
        transactionIndex: row.transactionIndex,
        shareToken: row.shareToken,
        owner: row.orderCreator,
        creationTime: row.creationTime,
        orderState: row.orderState,
        price: row.price,
        amount: row.amount,
        fullPrecisionPrice: row.fullPrecisionPrice,
        fullPrecisionAmount: row.fullPrecisionAmount,
        tokensEscrowed: row.tokensEscrowed,
        sharesEscrowed: row.sharesEscrowed,
      };
    });
    callback(null, orders);
  });
}
