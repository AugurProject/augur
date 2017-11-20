import { each } from "async";
import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";
import { queryModifier, getMarketsWithReportingState } from "./database";

// Returning marketIDs should likely be more generalized, since it is a single line change for most getters (awaiting reporting, by user, etc)
export function getMarkets(db: Knex, universe: Address, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err?: Error|null, result?: any) => void): void {
  if (universe == null) return callback(new Error("Must provide universe"));
  let query = getMarketsWithReportingState(db, ["markets.marketID"]);
  if (universe != null) query = query.where({ universe });

  query = queryModifier(query, "volume", "desc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err?: Error|null, marketsRows?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!marketsRows) return callback(null);
    callback(null, marketsRows.map((marketsRow: MarketsContractAddressRow): Address => marketsRow.marketID));
  });
}
