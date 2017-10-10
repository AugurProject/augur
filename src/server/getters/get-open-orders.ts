import * as _ from "lodash";
import * as Knex from "knex";
import { Address, Bytes32 } from "../../types";

interface OrdersRow {
  order_id: Bytes32,
  market_id: Address,
  outcome: number,
  share_token: Address,
  order_type: string,
  order_creator: Address,
  creation_time: number,
  creation_block_number: number,
  price: number|string,
  amount: number|string,
  tokens_escrowed: number|string,
  shares_escrowed: number|string,
  trade_group_id: Bytes32|null
}

interface Order {
  shareToken: Address,
  orderCreator: Address,
  creationTime: number,
  creationBlockNumber: number,
  price: number|string,
  amount: number|string,
  tokensEscrowed: number|string,
  sharesEscrowed: number|string
}

interface Orders {
  [marketID: string]: {
    [outcome: number]: {
      [orderType: string]: {
        [orderId: string]: Order
      }
    }
  }
}

// market, outcome, creator, orderType, limit, sort
export function getOpenOrders(db: Knex, marketID: Address|null, outcome: number|null, orderType: string|null, creator: Address|null, callback: (err?: Error|null, result?: any) => void): void {
  const queryData: {} = _.omitBy({
    market_id: marketID,
    outcome: outcome,
    order_type: orderType,
    order_creator: creator
  }, _.isNull);
  db("orders").where(queryData).asCallback((err?: Error|null, ordersRows?: OrdersRow[]): void => {
    if (err) return callback(err);
    if (!ordersRows || !ordersRows.length) return callback(null);
    const orders: Orders = {};
    ordersRows.forEach((row: OrdersRow): void => {
      if (!orders[row.market_id]) orders[row.market_id] = {};
      if (!orders[row.market_id][row.outcome]) orders[row.market_id][row.outcome] = {};
      if (!orders[row.market_id][row.outcome][row.order_type]) orders[row.market_id][row.outcome][row.order_type] = {};
      orders[row.market_id][row.outcome][row.order_type][row.order_id] = {
        shareToken: row.share_token,
        orderCreator: row.order_creator,
        creationTime: row.creation_time,
        creationBlockNumber: row.creation_block_number,
        price: row.price,
        amount: row.amount,
        tokensEscrowed: row.tokens_escrowed,
        sharesEscrowed: row.shares_escrowed
      };
    });
    callback(null, orders);
  });
}
