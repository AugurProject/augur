import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, OrderState } from "../../types";
import { augurEmitter } from "../../events";

export function processOrderCanceledLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("OrderCanceled", log);
  db.transacting(trx).from("orders").where("orderID", log.orderId).update({ orderState: OrderState.CANCELED }).asCallback(callback);
}

export function processOrderCanceledLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("OrderCanceled", log);
  db.transacting(trx).from("orders").where("orderID", log.orderId).update({ orderState: OrderState.OPEN }).asCallback(callback);
}
