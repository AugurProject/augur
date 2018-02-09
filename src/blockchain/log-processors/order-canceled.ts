import Augur from "augur.js";
import * as Knex from "knex";
import { Bytes32, FormattedEventLog, ErrorCallback, OrderState } from "../../types";
import { augurEmitter } from "../../events";

interface MarketIDAndOutcome {
  marketID: Bytes32;
  outcome: number;
}

export function processOrderCanceledLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("orders").where("orderID", log.orderId).update({ orderState: OrderState.CANCELED }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    trx.first("marketID", "outcome").from("orders").where("orderID", log.orderId).asCallback((err: Error|null, ordersRow?: MarketIDAndOutcome): void => {
      if (err) return callback(err);
      augurEmitter.emit("OrderCanceled", Object.assign({}, ordersRow, log));
      callback(null);
    });
  });
}

export function processOrderCanceledLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("orders").where("orderID", log.orderId).update({ orderState: OrderState.OPEN }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    trx.first("marketID", "outcome").from("orders").where("orderID", log.orderId).asCallback((err: Error|null, ordersRow?: MarketIDAndOutcome): void => {
      if (err) return callback(err);
      augurEmitter.emit("OrderCanceled", Object.assign({}, ordersRow, log));
      callback(null);
    });
  });
}
