import * as _ from "lodash";
import * as Knex from "knex";
import { Address, Bytes32, OrdersRow } from "../../types";

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
  betterOrderId: Bytes32|null;
  worseOrderId: Bytes32|null;
}

interface Orders {
  [marketID: string]: {
    [outcome: number]: {
      [orderType: string]: {
        [orderId: string]: Order;
      };
    };
  };
}

// market, outcome, creator, orderType, limit, sort
export function getOpenOrders(db: Knex, marketID: Address|null, outcome: number|null, orderType: string|null, creator: Address|null, callback: (err?: Error|null, result?: any) => void): void {
  const queryData: {} = _.omitBy({
    market_id: marketID,
    outcome,
    order_type: orderType,
    order_creator: creator
  }, _.isNull);
  db("orders").where(queryData).asCallback((err?: Error|null, ordersRows?: Array<OrdersRow>): void => {
    if (err) return callback(err);
    if (!ordersRows || !ordersRows.length) return callback(null);
    const orders: Orders = {};
    ordersRows.forEach((row: OrdersRow): void => {
      if (!orders[row.market_id]) orders[row.market_id] = {};
      if (!orders[row.market_id][row.outcome]) orders[row.market_id][row.outcome] = {};
      if (!orders[row.market_id][row.outcome][row.order_type]) orders[row.market_id][row.outcome][row.order_type] = {};
      orders[row.market_id][row.outcome][row.order_type][row.order_id] = {
        shareToken: row.share_token,
        owner: row.order_creator,
        creationTime: row.creation_time,
        creationBlockNumber: row.creation_block_number,
        price: row.price,
        amount: row.amount,
        fullPrecisionPrice: row.full_precision_price,
        fullPrecisionAmount: row.full_precision_amount,
        tokensEscrowed: row.tokens_escrowed,
        sharesEscrowed: row.shares_escrowed,
        betterOrderId: row.better_order_id,
        worseOrderId: row.worse_order_id
      };
    });
    callback(null, orders);
  });
}
