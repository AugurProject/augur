import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";

// Should return the total amount of fees earned so far by the market creator.
export function getMarketsCreatedByUser(db: Knex, creator: Address, callback: (err?: Error|null, result?: Array<Address>) => void): void {
  db.raw(`SELECT "marketID" FROM markets WHERE "marketCreator" = ?`, [creator]).asCallback((err?: Error|null, rows?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!rows || !rows.length) return callback(null);
    callback(null, rows.map((row: MarketsContractAddressRow): Address => row.marketID));
  });
}
