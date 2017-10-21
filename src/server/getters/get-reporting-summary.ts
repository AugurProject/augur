import * as Knex from "knex";
import { Address } from "../../types";

// Look up reporting summary values. Should take reportingWindow (address) as a parameter and the response should include total number of markets up for reporting, total number of markets up for dispute, total number of markets undergoing and/or resolved via each reporting "tier" (automated, limited, full, fork), etc.
export function getReportingSummary(db: Knex, reportingWindow: Address, callback: (err: Error|null, result?: any) => void): void {

}
