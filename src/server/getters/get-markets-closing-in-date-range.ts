import { Database } from "sqlite3";
import { Address, MarketsContractAddressRow } from "../../types";

// Input: Date Range
// Output: Markets Closing in Range
export function getMarketsClosingInDateRange(db: Database, earliestClosingTime: number, latestClosingTime: number, universe: Address, limit: number|null|undefined, callback: (err?: Error|null, result?: any) => void): void {
  let query = `SELECT market_id FROM markets WHERE end_time >= ? AND end_time <= ? AND universe = ? ORDER BY end_time DESC`;
  const queryParams = [earliestClosingTime, latestClosingTime, universe];
  if (limit) {
    query = `${query} LIMIT ?`;
    queryParams.push(limit);
  }
  db.all(query, queryParams, (err?: Error|null, rows?: MarketsContractAddressRow[]): void => {
    if (err) return callback(err);
    if (!rows || !rows.length) return callback(null);
    callback(null, rows.map((row: MarketsContractAddressRow): Address => row.market_id));
  });
}
