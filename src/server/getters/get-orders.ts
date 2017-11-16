import * as _ from "lodash";
import * as Knex from "knex";
import { Address, Bytes32, OrdersRow, OrderState } from "../../types";
import { queryModifier } from "./database";

interface Order {
  shareToken: Address;
  owner: Address;
  creationTime: number;
  creationBlockNumber: number;
  price: number|string;
  amount: number|string;
  fullPrecisionPrice: number|string;
  fullPrecisionAmount: number|string;
  tokensEscrowed: number|string;
  sharesEscrowed: number|string;
}

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
export function getOrders(db: Knex, universe: Address|null, marketID: Address|null, outcome: number|null, orderType: string|null, creator: Address|null, orderState: OrderState|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null && marketID == null) return callback(new Error("Must provide universe, either via universe or marketID"));
  const queryData: {} = _.omitBy({
    universe,
    outcome,
    orderType,
    "orderCreator": creator,
    "orders.marketID": marketID,
  }, _.isNil);
  const query: Knex.QueryBuilder = db.select(["orders.*", `blocks.timestamp as creationTime`]).from("orders");
  query.leftJoin("blocks", "orders.creationBlockNumber", "blocks.blockNumber");
  query.leftJoin("markets", "orders.marketID", "markets.marketID");
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
        shareToken: row.shareToken,
        owner: row.orderCreator,
        creationTime: row.creationTime,
        creationBlockNumber: row.creationBlockNumber,
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
