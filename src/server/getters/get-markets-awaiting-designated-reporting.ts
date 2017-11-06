import { each } from "async";
import * as Knex from "knex";
import { Address, MarketsContractAddressRow, ReportingState } from "../../types";
import { queryModifier, getMarketsWithReportingState } from "./database";

// Look up all markets that are currently awaiting designated (automated) reporting.
// Should accept a designatedReporterAddress parameter that filters by designated reporter address.
export function getMarketsAwaitingDesignatedReporting(db: Knex, designatedReporter: Address|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err?: Error|null, result?: any) => void): void {

  // TODO: I don't have a reference to Augur object here or in calling function, figure out if we're ok with not using constant value or resolve
  let query = getMarketsWithReportingState(db, ["markets.marketID"]).where("reportingState", ReportingState.DESIGNATED_REPORTING);
  if (designatedReporter != null) query = query.where({ designatedReporter });

  query = queryModifier(query, "endTime", "desc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err?: Error|null, marketsRows?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!marketsRows) return callback(null);
    callback(null, marketsRows.map((marketsRow: MarketsContractAddressRow): Address => marketsRow.marketID));
  });
}
