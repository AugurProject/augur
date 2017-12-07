import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

export function processReportsDisputedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: ReportsDisputed");
  console.log(log);
  callback(null);
}

export function processReportsDisputedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: ReportsDisputed removal");
  console.log(log);
  augurEmitter.emit("ReportsDisputed", log);
  callback(null);
}
