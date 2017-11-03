import * as _ from "lodash";
import * as Knex from "knex";
import { Address, JoinedReportsMarketsRow, UIReport } from "../../types";
import { queryModifier } from "./database";

interface UIReports {
  [universe: string]: {
    [marketID: string]: Array<UIReport>,
  };
}

// Look up a user's reporting history (i.e., all reports submitted by a given reporter); should take reporter (address) as a required parameter and take market, universe, and reportingWindow all as optional parameters. For reporting windows that are complete, should also include the consensus outcome, whether the user's report matched the consensus, how much REP the user gained or lost from redistribution, and how much the user earned in reporting fees.
export function getReportingHistory(db: Knex, universe: Address|null, reporter: Address, marketID: Address|null, reportingWindow: Address|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  // { universe: { marketID: { marketID, reportingWindow, payoutNumerators, isCategorical, isScalar, isIndeterminate } } }
  if (universe == null && marketID == null && reportingWindow == null) return callback(new Error("Must provide reference to universe, specify universe, marketID, reportingWindow"));
  let query = db.select([
    "reports.marketID",
    "markets.universe",
    "markets.reportingWindow",
    "reports.stakedToken",
    "reports.amountStaked",
    "reportingState",
    "staked_tokens.isInvalid",
    "staked_tokens.payout0",
    "staked_tokens.payout1",
    "staked_tokens.payout2",
    "staked_tokens.payout3",
    "staked_tokens.payout4",
    "staked_tokens.payout5",
    "staked_tokens.payout6",
    "staked_tokens.payout7",
  ]).from("reports").join("markets", "markets.marketID", "reports.marketID").where({reporter});
  if (marketID != null) query.where("reports.marketID", marketID);
  if (universe != null) query.where("universe", universe);
  if (reportingWindow != null) query.where("reportingWindow", reportingWindow);
  query = query.join("staked_tokens", "reports.stakedToken", "staked_tokens.stakedToken");
  query = queryModifier(query, "reportID", "asc", sortBy, isSortDescending, limit, offset);
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
        stakedToken: row.stakedToken,
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
