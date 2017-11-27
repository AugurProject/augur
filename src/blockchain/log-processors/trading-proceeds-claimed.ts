import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";

export function processTradingProceedsClaimedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: TradingProceedsClaimed");
  console.log(log);
  callback(null);
}

export function processTradingProceedsClaimedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: TradingProceedsClaimed removal");
  console.log(log);
  callback(null);
}
