import * as Knex from "knex";
import { Address } from "../../types";

// Look up all markets that are currently available for all-reporters reporting.
export function getMarketsAwaitingAllReporting(db: Knex, reportingWindow: Address, callback: (err: Error|null, result?: any) => void): void {

}
