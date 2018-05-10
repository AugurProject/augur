import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address } from "../../types";

export interface BetterWorseResult {
  betterOrderId: Address|null;
  worseOrderId: Address|null;
}

interface OrderRow {
  orderId: string;
  price: BigNumber;
}

function sortOrders(left: OrderRow, right: OrderRow) {
  return left.price.isGreaterThan(right.price) ? 1 : -1;
}

export function getBetterWorseOrders(db: Knex, marketId: Address, outcome: number, orderType: string, price: string, callback: (err?: Error|null, result?: BetterWorseResult) => void): void {
  if (marketId == null || outcome == null || orderType == null || price == null) return callback(new Error("Must provide marketId, outcome, orderType, and price"));
  if (orderType !== "buy" && orderType !== "sell") return callback(new Error(`orderType must be either "buy" or "sell"`));
  const ordersQuery = db("orders").select("orderId", "price").where({ orderState: "OPEN", marketId, outcome, orderType });
  ordersQuery.asCallback((err: Error|null, orders: Array<OrderRow>) => {
    if (err) return callback(err);
    const priceBN = new BigNumber(price);
    const [lesserOrders, greaterOrders] = _.partition(orders, (order) => order.price.isLessThan(priceBN));
    lesserOrders.sort(sortOrders);
    greaterOrders.sort(sortOrders);
    const greaterOrder = (greaterOrders.length > 0 ? greaterOrders[0].orderId : null);
    const lesserOrder = (lesserOrders.length > 0 ? lesserOrders[lesserOrders.length - 1].orderId : null);
    if (orderType === "buy") {
      return callback(null, {
        betterOrderId: greaterOrder,
        worseOrderId: lesserOrder,
      });
    } else {
      return callback(null, {
        betterOrderId: lesserOrder,
        worseOrderId: greaterOrder,
      });
    }
  });
}
