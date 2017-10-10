import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";

// Input: Date Range
// Output: Markets Closing in Range
export function getMarketsClosingInDateRange(db: Knex, earliestClosingTime: number, latestClosingTime: number, universe: Address, limit: number|null|undefined, callback: (err?: Error|null, result?: any) => void): void {

  let query: Knex.QueryBuilder = db
    .select("market_id").from("markets")
    .whereRaw("end_time >= ? and end_time <= ? and universe = ?", [earliestClosingTime, latestClosingTime, universe])
    .orderBy("end_time", "desc");

  if (limit) query = query.limit(limit);

  query.asCallback((err?: Error|null, rows?: MarketsContractAddressRow[]): void => {
    if (err) return callback(err);
    if (!rows || !rows.length) return callback(null);
    callback(null, rows.map((row: MarketsContractAddressRow): Address => row.market_id));
  });
}
