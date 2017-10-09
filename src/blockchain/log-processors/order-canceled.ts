import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processOrderCanceledLog(db: Knex, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  db.transacting(trx).from("orders").where({order_id: log.orderId}).del().asCallback(callback);
}
