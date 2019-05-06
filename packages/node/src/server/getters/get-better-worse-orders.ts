import * as t from "io-ts";
import Knex from "knex";
import * as _ from "lodash";

import { Address, BigNumber } from "../../types";
import { ZERO } from "../../constants";

export const OrderType = t.keyof({
  buy: null,
  sell: null,
});

export const BetterWorseOrdersParams = t.type({
  marketId: t.string,
  outcome: t.number,
  orderType: OrderType,
  price: t.string,
});

export interface BetterWorseResult {
  betterOrderId: Address|null;
  worseOrderId: Address|null;
}

interface OrderRow {
  orderId: string|null;
  price: BigNumber;
}

export async function getBetterWorseOrders(db: Knex, augur: {}, params: t.TypeOf<typeof BetterWorseOrdersParams>): Promise<BetterWorseResult> {
  const ordersQuery = db("orders").select("orderId", "price").where({ orderState: "OPEN", ..._.pick(params, ["marketId", "outcome", "orderType"])});
  const orders: Array<OrderRow> = await ordersQuery;
  const priceBN = new BigNumber(params.price);
  const [lesserOrders, greaterOrders] = _.partition(orders, (order) => order.price.lt(priceBN));
  const greaterOrder = _.reduce(greaterOrders, (result, order) => (result.orderId === null || order.price.lt(result.price) ? order : result), { orderId: null, price: ZERO });
  const lesserOrder = _.reduce(lesserOrders, (result, order) => (result.orderId === null || order.price.gt(result.price) ? order : result), { orderId: null, price: ZERO });
  if (params.orderType === "buy") {
    return {
      betterOrderId: greaterOrder.orderId,
      worseOrderId: lesserOrder.orderId,
    };
  } else {
    return {
      betterOrderId: lesserOrder.orderId,
      worseOrderId: greaterOrder.orderId,
    };
  }
}
