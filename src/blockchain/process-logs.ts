import Augur from "augur.js";
import { each } from "async";
import * as Knex from "knex";
import { FormattedLog, LogProcessor, ErrorCallback } from "../types";

export function processLogs(db: Knex, augur: Augur, trx: Knex.Transaction, logs: Array<FormattedLog>, processLog: LogProcessor, processLogRemoval: LogProcessor, callback: ErrorCallback): void {
  each(logs, (log: FormattedLog, nextLog: ErrorCallback) => !log.removed ? processLog(db, augur, trx, log, nextLog) : processLogRemoval(db, augur, trx, log, nextLog), callback);
}
