import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address } from "../../types";
import { ZERO } from "../../constants";

export interface BetterWorseResult {
  betterOrderId: Address|null;
  worseOrderId: Address|null;
}

interface OrderRow {
  orderId: string|null;
  price: BigNumber;
}

export function getBetterWorseOrders(db: Knex, marketId: Address, outcome: number, orderType: string, price: string, callback: (err?: Error|null, result?: BetterWorseResult) => void): void {
  if (marketId == null || outcome == null || orderType == null || price == null) return callback(new Error("Must provide marketId, outcome, orderType, and price"));
  if (orderType !== "buy" && orderType !== "sell") return callback(new Error(`orderType must be either "buy" or "sell"`));
  const ordersQuery = db("orders").select("orderId", "price").where({ orderState: "OPEN", marketId, outcome, orderType }).whereNull("isRemoved");
  ordersQuery.asCallback((err: Error|null, orders: Array<OrderRow>) => {
    if (err) return callback(err);
    const priceBN = new BigNumber(price);
    const [lesserOrders, greaterOrders] = _.partition(orders, (order) => order.price.isLessThan(priceBN));
    const greaterOrder = _.reduce(greaterOrders, (result, order) => (result.orderId === null || order.price.isLessThan(result.price) ? order : result), { orderId: null, price: ZERO});
    const lesserOrder = _.reduce(lesserOrders, (result, order) => (result.orderId === null || order.price.isGreaterThan(result.price) ? order : result), { orderId: null, price: ZERO});
    if (orderType === "buy") {
      return callback(null, {
        betterOrderId: greaterOrder.orderId,
        worseOrderId: lesserOrder.orderId,
      });
    } else {
      return callback(null, {
        betterOrderId: lesserOrder.orderId,
        worseOrderId: greaterOrder.orderId,
      });
    }
  });
}
