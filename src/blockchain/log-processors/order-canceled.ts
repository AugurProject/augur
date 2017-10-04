import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processOrderCanceledLog(db: Knex, log: FormattedLog, callback: ErrorCallback): void {
  db("orders").where({order_id: log.orderId}).del();
}
