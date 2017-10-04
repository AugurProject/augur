import { each } from "async";
import * as Knex from "knex";
import { FormattedLog, LogProcessor, ErrorCallback } from "../types";

export function processLogs(db: Knex, logs: FormattedLog[], processLog: LogProcessor, callback: ErrorCallback): void {
  each(logs, (log: FormattedLog, nextLog: ErrorCallback) => processLog(db, log, nextLog), callback);
}
