import { each } from "async";
import { SqlLiteDb, FormattedLog, ErrorCallback } from "./types";

export function processLogs(db: SqlLiteDb, logs: FormattedLog[], processLog, callback: ErrorCallback): void {
  each(logs, (log: FormattedLog, nextLog) => processLog(db, log, nextLog), callback);
}
