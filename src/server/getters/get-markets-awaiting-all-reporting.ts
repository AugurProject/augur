import * as Knex from "knex";
import { Address } from "../../types";
import { sortDirection } from "../../utils/sort-direction";

// Look up all markets that are currently available for all-reporters reporting.
export function getMarketsAwaitingAllReporting(db: Knex, reportingWindow: Address, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  // query = query.orderBy(sortBy || "volume", sortDirection(isSortDescending, "desc"));
  // if (limit != null) query = query.limit(limit);
  // if (offset != null) query = query.offset(offset);
}
