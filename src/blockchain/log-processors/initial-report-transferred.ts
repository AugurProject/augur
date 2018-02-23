import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

export function processInitialReporterTransferredLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("initial_reports").where("marketId", log.market).update({ reporter: log.to }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("InitialReporterTransferred", log);
    callback(null);
  });
}

export function processInitialReporterTransferredLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("initial_reports").where("marketId", log.market).update({ reporter: log.from }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("InitialReporterTransferred", log);
    callback(null);
  });
}
