import { Database } from "sqlite3";
import { Address } from "./types";

// Look up a user's reporting history (i.e., all reports submitted by a given reporter); should take account (address) as a required parameter and take market, universe, and reportingWindow all as optional parameters. For reporting windows that are complete, should also include the consensus outcome, whether the user's report matched the consensus, how much REP the user gained or lost from redistribution, and how much the user earned in reporting fees.
export function getReportingHistory(db: Database, account: Address, market: Address|null, universe: Address|null, reportingWindow: Address|null, callback: (err?: Error|null, result?: any) => void) {

}
