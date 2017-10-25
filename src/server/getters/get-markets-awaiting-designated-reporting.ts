import { each } from "async";
import * as Knex from "knex";
import { Address, MarketsRow, UIMarketInfo, UIMarketsInfo, ErrorCallback } from "../../types";
import { reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState } from "./get-market-info";
import { sortDirection } from "../../utils/sort-direction";

// Look up all markets that are currently awaiting designated (automated) reporting.
// Should accept a designatedReporterAddress parameter that filters by designated reporter address.
export function getMarketsAwaitingDesignatedReporting(db: Knex, designatedReporter: Address|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err?: Error|null, result?: any) => void): void {

  // TODO: NULL isn't right here, we're going to an enumerated list to match the contracts
  let query = getMarketsWithReportingState(db).whereNull("markets.marketStateID");
  if (designatedReporter != null) query = query.where({ designatedReporter });

  query = query.orderBy(sortBy || "endTime", sortDirection(isSortDescending, "desc"));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  query.asCallback((err?: Error|null, marketsRows?: Array<MarketsRow>): void => {
    if (err) return callback(err);
    if (!marketsRows || !marketsRows.length) return callback(null);
    const marketsInfo: UIMarketsInfo = marketsRows.map((marketsRow: any): UIMarketInfo => reshapeMarketsRowToUIMarketInfo(marketsRow, []));
    callback(null, marketsInfo);
  });
}
