import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

export function processInitialReporterRedeemedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("initial_reports").where("marketID", log.market).update({ redeemed: true }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("InitialReporterRedeemed", log);
    callback(null);
  });
}

export function processInitialReporterRedeemedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("initial_reports").where("marketID", log.market).update({ redeemed: false }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("InitialReporterRedeemed", log);
    callback(null);
  });
}
