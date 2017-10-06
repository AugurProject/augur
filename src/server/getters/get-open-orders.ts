import { Database } from "sqlite3";
import { Address, Bytes32 } from "../../types";

interface OrdersRow {
  order_id: Bytes32,
  market: Address,
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
  [market: string]: {
    [outcome: number]: {
      [orderType: string]: {
        [orderId: string]: Order
      }
    }
  }
}

// market, outcome, creator, orderType, limit, sort
export function getOpenOrders(db: Database, market: Address|null, outcome: number|null, orderType: string|null, creator: Address|null, callback: (err?: Error|null, result?: any) => void): void {
  const conditions = [{
    name: "market",
    value: market
  }, {
    name: "outcome",
    value: outcome
  }, {
    name: "order_type",
    value: orderType
  }, {
    name: "order_creator",
    value: creator
  }].filter((condition) => condition.value != null);
  const whereClause = conditions.map((condition) => `${condition.name} = ?`).join(" AND ");
  db.all(`SELECT * FROM orders WHERE ${whereClause}`, conditions.map((condition) => condition.value), (err?: Error|null, ordersRows?: OrdersRow[]): void => {
    if (err) return callback(err);
    if (!ordersRows || !ordersRows.length) return callback(null);
    const orders: Orders = {};
    ordersRows.forEach((row: OrdersRow) => {
      if (!orders[row.market]) orders[row.market] = {};
      if (!orders[row.market][row.outcome]) orders[row.market][row.outcome] = {};
      if (!orders[row.market][row.outcome][row.order_type]) orders[row.market][row.outcome][row.order_type] = {};
      orders[row.market][row.outcome][row.order_type][row.order_id] = {
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
