import * as Knex from "knex";
import { Address } from "../../types";

// Look up all markets that are currently available for limited reporting.
// Must be able to sort by number of reports submitted for each market so far, and the response should include the number of reports already submitted -- as well as the payoutNumerator values of each of the reports + the amount staked on each -- as part of the response.
export function getMarketsAwaitingLimitedReporting(db: Knex, reportingWindow: Address, callback: (err?: Error|null, result?: any) => void): void {

}
