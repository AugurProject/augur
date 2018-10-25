import Augur from "augur.js";
import * as Knex from "knex";
import { Bytes32, FormattedEventLog, OrderState } from "../../types";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

interface MarketIDAndOutcomeAndPrice {
  marketId: Bytes32;
  outcome: number;
  price: string|number;
  orderType: string|number;
}

export async function processOrderCanceledLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const orderTypeLabel = log.orderType === "0" ? "buy" : "sell";
    await db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.CANCELED });
    await db.into("orders_canceled").insert({ orderId: log.orderId, transactionHash: log.transactionHash, logIndex: log.logIndex, blockNumber: log.blockNumber });
    const ordersRow: MarketIDAndOutcomeAndPrice = await db.first("marketId", "outcome", "price").from("orders").where("orderId", log.orderId);
    if (ordersRow) ordersRow.orderType = orderTypeLabel;
    augurEmitter.emit(SubscriptionEventNames.OrderCanceled, Object.assign({}, log, ordersRow));
  };
}


export async function processOrderCanceledLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const orderTypeLabel = log.orderType === "0" ? "buy" : "sell";
    await db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.OPEN });
    await db.from("orders_canceled").where("orderId", log.orderId).delete();
    const ordersRow: MarketIDAndOutcomeAndPrice = await db.first("marketId", "outcome", "price").from("orders").where("orderId", log.orderId);
    if (ordersRow) ordersRow.orderType = orderTypeLabel;
    augurEmitter.emit(SubscriptionEventNames.OrderCanceled, Object.assign({}, log, ordersRow));
  };
}

