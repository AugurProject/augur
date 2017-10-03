import { Database } from "sqlite3";
import { Address } from "./types";

// Look up all markets that are currently available for all-reporters reporting.
export function getMarketsAwaitingAllReporting(db: Database, reportingWindow: Address, callback: (err?: Error|null, result?: any) => void) {

}
