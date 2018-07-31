import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";
import { queryModifier, getMarketsWithReportingState } from "./database";

// Returning marketIds should likely be more generalized, since it is a single line change for most getters (awaiting reporting, by user, etc)
export function getMarketsSearch(db: Knex, universe: Address, search: string, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err?: Error|null, result?: Array<string>) => void): void {
  if (universe == null) return callback(new Error("Must provide universe"));
  if (search == null) return callback(new Error("Must provide search terms"));
  const queryMarkets = getMarketsWithReportingState(db, ["markets.marketId", "marketStateBlock.timestamp as reportingStateUpdatedOn"]);
  queryMarkets.join("blocks as marketStateBlock", "marketStateBlock.blockNumber", "market_state.blockNumber");
  queryMarkets.where({ universe });

  const querySearch = db.raw("marketId FROM search_en WHERE content MATCH ?", [search]);
  queryMarkets.whereIn("markets.marketId", (queryBuilder) => queryBuilder.select(querySearch));

  queryModifier(db, queryMarkets, "volume", "desc", sortBy, isSortDescending, limit, offset, (err?: Error|null, marketsRows?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!marketsRows) return callback(null);
    callback(null, marketsRows.map((marketsRow: MarketsContractAddressRow): Address => marketsRow.marketId));
  });
}
