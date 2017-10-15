import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";

// Input: Date Range
// Output: Markets Closing in Range
export function getMarketsClosingInDateRange(db: Knex, earliestClosingTime: number, latestClosingTime: number, universe: Address, limit: number|null|undefined, callback: (err?: Error|null, result?: any) => void): void {

  let query: Knex.QueryBuilder = db
    .select("marketID").from("markets")
    .whereRaw("endTime >= ? and endTime <= ? and universe = ?", [earliestClosingTime, latestClosingTime, universe])
    .orderBy("endTime", "desc");

  if (limit) query = query.limit(limit);

  query.asCallback((err?: Error|null, rows?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!rows || !rows.length) return callback(null);
    callback(null, rows.map((row: MarketsContractAddressRow): Address => row.marketID));
  });
}
