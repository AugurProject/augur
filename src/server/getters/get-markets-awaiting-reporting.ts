import * as Knex from "knex";
import { Address, MarketsRow, UIMarketInfo, UIMarketsInfo, ErrorCallback } from "../../types";
import { reshapeMarketsRowToUIMarketInfo, getMarketsWithPhase } from "./get-market-info";
import { sortDirection } from "../../utils/sort-direction";

// Look up all markets that are currently available for limited reporting.
// Must be able to sort by number of reports submitted for each market so far, and the response should include the number of reports already submitted -- as well as the payoutNumerator values of each of the reports + the amount staked on each -- as part of the response.
export function getMarketsAwaitingReporting(db: Knex, reportingWindow: Address|null, reportingRound: number|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  const queryData: { [id: string]: any } = (reportingRound != null) ? { "market_state.round:": reportingRound } : {};
  if ( reportingWindow != null ) {
    queryData["markets.reportingWindow"] = reportingWindow;
  }
  let query = getMarketsWithPhase(db).where(queryData);

  query = query.orderBy(sortBy || "volume", sortDirection(isSortDescending, "desc"));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);

  // TODO: should we also consider a market_state's phase IS NULL?
  query.asCallback((err?: Error|null, marketsRows?: Array<MarketsRow>): void => {
    if (err) return callback(err);
    if (!marketsRows) return callback(null);
    const marketsInfo: UIMarketsInfo = marketsRows.map((marketsRow) => reshapeMarketsRowToUIMarketInfo(marketsRow, []));
    callback(null, marketsInfo);
  });
}
