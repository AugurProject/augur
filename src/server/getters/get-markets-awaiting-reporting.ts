import * as Knex from "knex";
import { Address, MarketsRow, UIMarketInfo, UIMarketsInfo, ErrorCallback } from "../../types";
import { reshapeMarketsRowToUIMarketInfo, getMarketsWithPhase } from "./get-market-info";

// Look up all markets that are currently available for limited reporting.
// Must be able to sort by number of reports submitted for each market so far, and the response should include the number of reports already submitted -- as well as the payoutNumerator values of each of the reports + the amount staked on each -- as part of the response.
export function getMarketsAwaitingReporting(db: Knex, reportingWindow: Address, reportingRound: number|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  const queryData: {} = (reportingRound != null) ? { "market_state.round:": reportingRound } : {};
  // query = query.orderBy(sortBy || "volume", sortDirection(isSortDescending, "desc"));
  // if (limit != null) query = query.limit(limit);
  // if (offset != null) query = query.offset(offset);

  // TODO: should we also consider a market_state's phase IS NULL?
  getMarketsWithPhase(db).where(queryData).asCallback((err?: Error|null, marketsRows?: Array<MarketsRow>): void => {
    if (err) return callback(err);
    if (!marketsRows || !marketsRows.length) return callback(null);
    const marketsInfo: UIMarketsInfo = marketsRows.map((marketsRow) => reshapeMarketsRowToUIMarketInfo(marketsRow, []));
    callback(null, marketsInfo);
  });
}
