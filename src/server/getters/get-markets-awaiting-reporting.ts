import * as Knex from "knex";
import { Address, MarketsContractAddressRow} from "../../types";
import { queryModifier, getMarketsWithReportingState } from "./database";

// Look up all markets that are currently available for reporting.
// Must be able to sort by number of reports submitted for each market so far, and the response should include the number of reports already submitted -- as well as the payoutNumerator values of each of the reports + the amount staked on each -- as part of the response.
export function getMarketsAwaitingReporting(db: Knex, universe: Address|null, feeWindow: Address|null, reportingState: string|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null && feeWindow == null) return callback(new Error("Must provide reference to universe, specify universe or feeWindow"));
  let query = getMarketsWithReportingState(db, ["markets.marketId"]);
  if (universe != null) query = query.where({ universe });
  if (feeWindow != null) query = query.where({ feeWindow });
  if (reportingState != null) query = query.where({ reportingState });

  query = queryModifier(query, "volume", "desc", sortBy, isSortDescending, limit, offset);

  // TODO: should we also consider a market_state's reportingState IS NULL?
  query.asCallback((err?: Error|null, marketsRows?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!marketsRows) return callback(null);
    callback(null, marketsRows.map((marketsRow: MarketsContractAddressRow): Address => marketsRow.marketId));
  });
}
