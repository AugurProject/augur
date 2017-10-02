import { SqlLiteDb, Address } from "./types";

// Look up all markets that are currently able to be disputed. Response should include the value of the bond needed to actually dispute the result.
export function getDisputableMarkets(db: SqlLiteDb, reportingWindow: Address, callback: (err?: Error|null, result?: any) => void) {

}
