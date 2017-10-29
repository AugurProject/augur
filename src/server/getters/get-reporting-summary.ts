import * as Knex from "knex";
import { Address } from "../../types";
import { sortDirection } from "../../utils/sort-direction";

// Look up reporting summary values. Should take reportingWindow (address) as a parameter and the response should include total number of markets up for reporting, total number of markets up for dispute, total number of markets undergoing and/or resolved via each reporting "tier" (automated, limited, full, fork), etc.
export function getReportingSummary(db: Knex, reportingWindow: Address, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  //   query = queryModifier(query, sortBy || "volume", isSortDescending, limit, offset);
}
