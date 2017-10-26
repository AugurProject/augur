import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";
import { sortDirection } from "../../utils/sort-direction";

export function getMarketsInCategory(db: Knex, category: Address, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: Array<Address>) => void): void {
  let query: Knex.QueryBuilder = db.select("marketID").from("markets").where({ category });
  query = query.orderBy(sortBy || "volume", sortDirection(isSortDescending, "desc"));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  query.asCallback((err: Error|null, marketsInCategory?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!marketsInCategory) return callback(null);
    callback(null, marketsInCategory.map((marketInCategory: MarketsContractAddressRow): Address => marketInCategory.marketID));
  });
}
