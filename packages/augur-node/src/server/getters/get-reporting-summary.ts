import * as t from "io-ts";
import * as Knex from "knex";
import Augur from "augur.js";
import { getMarketsWithReportingState } from "./database";

export const ReportingSummaryParams = t.type({
  disputeWindow: t.string,
});

interface UIReportingSummary {
  [reportingState: string]: number;
}

interface ReportingStateRow {
  reportingState: string;
  count: number;
}

// Look up reporting summary values. Should take disputeWindow (address) as a parameter and the response should include total number of markets up for reporting, total number of markets up for dispute,
// total number of markets undergoing and/or resolved via each reporting "tier" (automated, limited, full, fork), etc.
export async function getReportingSummary(db: Knex, augur: Augur, params: t.TypeOf<typeof ReportingSummaryParams>): Promise<UIReportingSummary> {
  const query = getMarketsWithReportingState(db, []).countDistinct("markets.marketId as count").where({ disputeWindow: params.disputeWindow });
  query.select("market_state.reportingState").groupBy("market_state.reportingState");
  const summaryRows: Array<ReportingStateRow> = await query;
  if (!summaryRows) return {};
  return summaryRows.reduce((acc, cur) => {
    acc[cur.reportingState] = cur.count;
    return acc;
  }, {} as UIReportingSummary);
}
