import * as _ from "lodash";
import * as Knex from "knex";
import { Address, JoinedReportsMarketsRow, UIReport } from "../../types";
import { sortDirection } from "../../utils/sort-direction";

interface UIReports {
  [universe: string]: {
    [marketID: string]: Array<UIReport>,
  };
}

// Look up a user's reporting history (i.e., all reports submitted by a given reporter); should take reporter (address) as a required parameter and take market, universe, and reportingWindow all as optional parameters. For reporting windows that are complete, should also include the consensus outcome, whether the user's report matched the consensus, how much REP the user gained or lost from redistribution, and how much the user earned in reporting fees.
export function getReportingHistory(db: Knex, reporter: Address, marketID: Address|null|undefined, universe: Address|null|undefined, reportingWindow: Address|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  // { universe: { marketID: { marketID, reportingWindow, payoutNumerators, isCategorical, isScalar, isIndeterminate } } }
  const queryData: any = { reporter };
  if (marketID != null) queryData["reports.marketID"] = marketID;
  if (universe != null) queryData.universe = universe;
  if (reportingWindow != null) queryData.reportingWindow = reportingWindow;
  let query = db.select([
    "reports.marketID",
    "markets.universe",
    "markets.reportingWindow",
    "reports.reportingToken",
    "reports.amountStaked",
    "reports.isInvalid",
    "reports.payout0",
    "reports.payout1",
    "reports.payout2",
    "reports.payout3",
    "reports.payout4",
    "reports.payout5",
    "reports.payout6",
    "reports.payout7",
  ]).from("reports").join("markets", "markets.marketID", "reports.marketID").where(queryData);
  query = query.orderBy(sortBy || "reportID", sortDirection(isSortDescending, "asc"));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  query.asCallback((err: Error|null, joinedReportsMarketsRows?: Array<JoinedReportsMarketsRow>): void => {
    if (err) return callback(err);
    if (!joinedReportsMarketsRows || !joinedReportsMarketsRows.length) return callback(null);
    const reports: UIReports = {};
    joinedReportsMarketsRows.forEach((row: JoinedReportsMarketsRow): void => {
      if (!reports[row.universe]) reports[row.universe] = {};
      if (!reports[row.universe][row.marketID]) reports[row.universe][row.marketID] = [];
      const payoutNumerators: Array<string|number|null> = [row.payout0, row.payout1, row.payout2, row.payout3, row.payout4, row.payout5, row.payout6, row.payout7].filter((payout: string|number|null): boolean => payout != null);
      const report: UIReport = {
        marketID: row.marketID,
        reportingWindow: row.reportingWindow,
        payoutNumerators,
        amountStaked: row.amountStaked,
        reportingToken: row.reportingToken,
        isCategorical: row.marketType === "categorical",
        isScalar: row.marketType === "scalar",
        isIndeterminate: Boolean(row.isInvalid),
        isSubmitted: true,
      };
      reports[row.universe][row.marketID].push(report);
    });
    callback(null, reports);
  });
}
