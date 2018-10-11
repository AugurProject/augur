import * as Knex from "knex";
import { getMarketsWithReportingState } from "./database";
import Augur from "augur.js";
import * as t from "io-ts";

export const ReportingSummaryParams = t.type({
  feeWindow: t.string,
});

// Look up reporting summary values. Should take feeWindow (address) as a parameter and the response should include total number of markets up for reporting, total number of markets up for dispute, total number of markets undergoing and/or resolved via each reporting "tier" (automated, limited, full, fork), etc.
export async function getReportingSummary(db: Knex, augur: Augur, params: t.TypeOf<typeof ReportingSummaryParams>): Promise<{}> {
  const query = getMarketsWithReportingState(db, []).countDistinct("markets.marketId as count").where({ feeWindow: params.feeWindow });
  query.select("market_state.reportingState").groupBy("market_state.reportingState");
  const summaryRows: Array<any> = await query;
  if (!summaryRows) return {};
  return summaryRows.reduce((acc, cur) => {
    acc[cur.reportingState] = cur.count;
    return acc;
  }, {});
}
