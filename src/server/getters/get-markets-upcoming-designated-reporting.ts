import * as Knex from "knex";
import { Address, MarketsContractAddressRow, ReportingState } from "../../types";
import { queryModifier, getMarketsWithReportingState } from "./database";

export function getMarketsUpcomingDesignatedReporting(db: Knex, universe: Address, designatedReporter: Address|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err?: Error|null, result?: any) => void): void {
  if (universe == null) return callback(new Error("Must provide universe"));

  let query = getMarketsWithReportingState(db, ["markets.marketId"]).where("reportingState", ReportingState.PRE_REPORTING);
  if (designatedReporter != null) query = query.where({ designatedReporter });

  query = queryModifier(query, "endTime", "asc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err?: Error|null, marketsRows?: Array<MarketsContractAddressRow>): void => {
    if (err) return callback(err);
    if (!marketsRows) return callback(null);
    callback(null, marketsRows.map((marketsRow: MarketsContractAddressRow): Address => marketsRow.marketId));
  });
}
