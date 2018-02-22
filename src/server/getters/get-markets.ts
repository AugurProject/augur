import * as Knex from "knex";
import { Address, MarketsContractAddressRow } from "../../types";
import { queryModifier, getMarketsWithReportingState } from "./database";

// Returning marketIds should likely be more generalized, since it is a single line change for most getters (awaiting reporting, by user, etc)
export function getMarkets(db: Knex, universe: Address, creator: Address|null|undefined, category: string|null|undefined, reportingState: string|null|undefined, feeWindow: Address|null|undefined, designatedReporter: Address|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err?: Error|null, result?: any) => void): void {
  if (universe == null) return callback(new Error("Must provide universe"));
  let query = getMarketsWithReportingState(db, ["markets.marketId"]);
  if (universe != null) query = query.where({ universe });
  if (creator != null) query = query.where({ marketCreator: creator });
  if (category != null) query = query.where({ category });
  if (reportingState != null) query = query.where({ reportingState });
  if (feeWindow != null) query = query.where({ feeWindow });
  if (designatedReporter != null) query = query.where({ designatedReporter });

  query = queryModifier(query, "volume", "desc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err?: Error|null, marketsRows?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!marketsRows) return callback(null);
    callback(null, marketsRows.map((marketsRow: MarketsContractAddressRow): Address => marketsRow.marketId));
  });
}
