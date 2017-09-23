import { each } from "async";
import { SqlLiteDb, FormattedLog } from "./types";

export function processLogs(db: SqlLiteDb, logs: FormattedLog[], processLog, callback: (err?: Error|null) => void): void {
  each(logs, (log: FormattedLog, nextLog) => processLog(db, log, nextLog), callback);
}
