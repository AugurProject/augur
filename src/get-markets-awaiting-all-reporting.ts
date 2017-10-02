import { SqlLiteDb, Address } from "./types";

// Look up all markets that are currently available for all-reporters reporting.
export function getMarketsAwaitingAllReporting(db: SqlLiteDb, reportingWindow: Address, callback: (err?: Error|null, result?: any) => void) {

}
