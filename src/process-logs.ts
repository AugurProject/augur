import { each } from "async";
import { Database } from "sqlite3";
import { FormattedLog, LogProcessor, ErrorCallback } from "./types";

export function processLogs(db: Database, logs: FormattedLog[], processLog: LogProcessor, callback: ErrorCallback): void {
  each(logs, (log: FormattedLog, nextLog) => processLog(db, log, nextLog), callback);
}
