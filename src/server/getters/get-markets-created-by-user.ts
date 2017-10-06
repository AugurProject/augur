import { Database } from "sqlite3";
import { Address, MarketsContractAddressRow } from "../../types";

// Should return the total amount of fees earned so far by the market creator.
export function getMarketsCreatedByUser(db: Database, creator: Address, callback: (err?: Error|null, result?: Address[]) => void): void {
  db.all(`SELECT market_id FROM markets WHERE market_creator = ?`, [creator], (err?: Error|null, rows?: MarketsContractAddressRow[]): void => {
    if (err) return callback(err);
    if (!rows || !rows.length) return callback(null);
    callback(null, rows.map((row: MarketsContractAddressRow): Address => row.market_id));
  });
}
