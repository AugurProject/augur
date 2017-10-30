import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";
import { queryModifier } from "./database";

// Should return the total amount of fees earned so far by the market creator.
export function getMarketsCreatedByUser(db: Knex, creator: Address, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: Array<Address>) => void): void {
  let query = db.select("marketID").from("markets").where({ marketCreator: creator });
  query = queryModifier(query, "volume", "desc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err: Error|null, rows?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!rows) return callback(null);
    callback(null, rows.map((row: MarketsContractAddressRow): Address => row.marketID));
  });
}
