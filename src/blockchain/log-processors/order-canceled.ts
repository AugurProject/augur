import { Database } from "sqlite3";
import { FormattedLog, ErrorCallback } from "../../types";

export function processOrderCanceledLog(db: Database, log: FormattedLog, callback: ErrorCallback): void {
  db.run(`DELETE FROM orders WHERE order_id = ?`, [log.orderId], callback);
}
