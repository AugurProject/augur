import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, OrderState } from "../../types";
import { augurEmitter } from "../../events";

export function processReportingWindowCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const reportingWindowToInsert = {
    reportingWindow: log.reportingWindow,
    reportingWindowID: log.id,
    universe: log.universe,
    startBlockNumber: log.blockNumber,
    startTime: log.startTime,
    endBlockNumber: null,
    endTime: log.endTime,
    fees: 0,
  };
  augurEmitter.emit("ReportingWindowCreated", reportingWindowToInsert);
  db.transacting(trx).from("reporting_windows").insert(reportingWindowToInsert).asCallback(callback);
}

export function processReportingWindowCreatedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("ReportingWindowCreated", log);
  db.transacting(trx).from("reporting_windows").where({reportingWindow: log.reportingWindow}).del().asCallback(callback);
}
