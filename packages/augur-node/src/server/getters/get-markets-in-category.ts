import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";
import { queryModifier } from "./database";

export function getMarketsInCategory(db: Knex, universe: Address, category: string, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: Array<Address>) => void): void {
  if (universe == null) return callback(new Error("Must provide universe"));
  const query: Knex.QueryBuilder = db.select("marketId").from("markets").where({ category, universe });
  queryModifier(db, query, "volume", "desc", sortBy, isSortDescending, limit, offset, (err: Error|null, marketsInCategory?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!marketsInCategory) return callback(null);
    callback(null, marketsInCategory.map((marketInCategory: MarketsContractAddressRow): Address => marketInCategory.marketId));
  });
}
