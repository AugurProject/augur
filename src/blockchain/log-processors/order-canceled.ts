import Augur from "augur.js";
import * as Knex from "knex";
import { Bytes32, FormattedEventLog, ErrorCallback, OrderState } from "../../types";
import { augurEmitter } from "../../events";

interface MarketIDAndOutcomeAndPrice {
  marketId: Bytes32;
  outcome: number;
  price: string|number;
  orderType: string|number;
}

export function processOrderCanceledLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const orderTypeLabel = log.orderType === "0" ? "buy" : "sell";
  db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.CANCELED }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db.into("orders_canceled").insert({ orderId: log.orderId, transactionHash: log.transactionHash, logIndex: log.logIndex, blockNumber: log.blockNumber }).asCallback((err: Error|null): void => {
      if (err) return callback(err);
      db.first("marketId", "outcome", "price").from("orders").where("orderId", log.orderId).asCallback((err: Error|null, ordersRow?: MarketIDAndOutcomeAndPrice): void => {
        if (err) return callback(err);
        if (ordersRow) ordersRow.orderType = orderTypeLabel;
        augurEmitter.emit("OrderCanceled", Object.assign({}, log, ordersRow));
        callback(null);
      });
    });
  });
}

export function processOrderCanceledLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const orderTypeLabel = log.orderType === "0" ? "buy" : "sell";
  db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.OPEN }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db.from("orders_canceled").where("orderId", log.orderId).delete().asCallback((err: Error|null): void => {
      if (err) return callback(err);
      db.first("marketId", "outcome", "price").from("orders").where("orderId", log.orderId).asCallback((err: Error|null, ordersRow?: MarketIDAndOutcomeAndPrice): void => {
        if (err) return callback(err);
        if (ordersRow) ordersRow.orderType = orderTypeLabel;
        augurEmitter.emit("OrderCanceled", Object.assign({}, log, ordersRow));
        callback(null);
      });
    });
  });
}
