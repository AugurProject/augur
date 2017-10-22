import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";
import { sortDirection } from "../../utils/sort-direction";

// Input: Date Range
// Output: Markets Closing in Range
export function getMarketsClosingInDateRange(db: Knex, earliestClosingTime: number, latestClosingTime: number, universe: Address, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  let query = db.select("marketID").from("markets").whereRaw(`"endTime" >= ? AND "endTime" <= ? AND universe = ?`, [earliestClosingTime, latestClosingTime, universe]);
  query = query.orderBy(sortBy || "endTime", sortDirection(isSortDescending, "desc"));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  query.asCallback((err: Error|null, rows?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!rows || !rows.length) return callback(null);
    callback(null, rows.map((row: MarketsContractAddressRow): Address => row.marketID));
  });
}
