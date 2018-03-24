import Augur from "augur.js";
import * as Knex from "knex";
import { Bytes32, FormattedEventLog, ErrorCallback, OrderState } from "../../types";
import { augurEmitter } from "../../events";

interface MarketIDAndOutcomeAndPrice {
  marketId: Bytes32;
  outcome: number;
  price: string|number;
}

export function processOrderCanceledLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.CANCELED }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db.first("marketId", "outcome", "price").from("orders").where("orderId", log.orderId).asCallback((err: Error|null, ordersRow?: MarketIDAndOutcomeAndPrice): void => {
      if (err) return callback(err);
      augurEmitter.emit("OrderCanceled", Object.assign({}, log, ordersRow));
      callback(null);
    });
  });
}

export function processOrderCanceledLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.OPEN }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db.first("marketId", "outcome", "price").from("orders").where("orderId", log.orderId).asCallback((err: Error|null, ordersRow?: MarketIDAndOutcomeAndPrice): void => {
      if (err) return callback(err);
      augurEmitter.emit("OrderCanceled", Object.assign({}, log, ordersRow));
      callback(null);
    });
  });
}
