import * as Knex from "knex";
import {Address, FeeWindowRow} from "../../types";

export function getFeeWindowCurrent(db: Knex, universe: Address, callback: (err?: Error | null, result?: any) => void): void {
  if (universe == null) return callback(new Error("Must provide universe"));
  const query = db.select("*").first().from("fee_windows")
    .whereNull("endBlockNumber")
    .where({universe})
    .orderBy("startTime", "ASC");

  query.asCallback((err: Error | null, feeWindow?: FeeWindowRow): void => {
    if (err) return callback(err);
    if (!feeWindow) return callback(null, null);
    callback(null, feeWindow);
  });
}
