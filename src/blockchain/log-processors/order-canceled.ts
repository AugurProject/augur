import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processOrderCanceledLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  db.transacting(trx).from("orders").where({orderID: log.orderID}).del().asCallback(callback);
}
