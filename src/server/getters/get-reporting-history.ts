import * as Knex from "knex";
import { Address, JoinedReportsMarketsRow, UIReport } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { queryModifier } from "./database";

interface UIReports<BigNumberType> {
  [universe: string]: {
    [marketId: string]: Array<UIReport<BigNumberType>>,
  };
}

// Look up a user's reporting history (i.e., all reports submitted by a given reporter); should take reporter (address) as a required parameter and take market, universe, and feeWindow all as optional parameters. For reporting windows that are complete, should also include the consensus outcome, whether the user's report matched the consensus, how much REP the user gained or lost from redistribution, and how much the user earned in reporting fees.
export function getReportingHistory(db: Knex, reporter: Address, universe: Address|null, marketId: Address|null, feeWindow: Address|null, earliestCreationTime: number|null, latestCreationTime: number|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  // { universe: { marketId: { marketId, feeWindow, payoutNumerators, isCategorical, isScalar, isIndeterminate } } }
  if (universe == null && marketId == null && feeWindow == null) return callback(new Error("Must provide reference to universe, specify universe, marketId, or feeWindow"));
  const query = db.select([
    "disputes.transactionHash",
    "disputes.logIndex",
    "disputes.blockNumber as creationBlockNumber",
    "blocks.blockHash",
    "blocks.timestamp as creationTime",
    "crowdsourcers.marketId",
    "markets.universe",
    "markets.feeWindow",
    "disputes.crowdsourcerId",
    "disputes.amountStaked",
    "payouts.isInvalid",
    "payouts.payout0",
    "payouts.payout1",
    "payouts.payout2",
    "payouts.payout3",
    "payouts.payout4",
    "payouts.payout5",
    "payouts.payout6",
    "payouts.payout7",
  ]).from("disputes").where({reporter});
  query.join("crowdsourcers", "disputes.crowdsourcerId", "crowdsourcers.crowdsourcerId");
  query.join("markets", "markets.marketId", "crowdsourcers.marketId");
  query.join("payouts", "crowdsourcers.payoutId", "payouts.payoutId");
  query.join("blocks", "blocks.blockNumber", "disputes.blockNumber");
  if (marketId != null) query.where("crowdsourcers.marketId", marketId);
  if (universe != null) query.where("universe", universe);
  if (feeWindow != null) query.where("feeWindow", feeWindow);
  if (earliestCreationTime != null) query.where("creationTime", ">=", earliestCreationTime);
  if (latestCreationTime != null) query.where("creationTime", "<=", latestCreationTime);
  queryModifier(query, "disputes.disputeId", "asc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err: Error|null, joinedReportsMarketsRows?: Array<JoinedReportsMarketsRow<BigNumber>>): void => {
    if (err) return callback(err);
    if (!joinedReportsMarketsRows) return callback(new Error("Internal error retrieving reporting history"));
    const reports: UIReports<string> = {};
    joinedReportsMarketsRows.forEach((row: JoinedReportsMarketsRow<BigNumber>): void => {
      if (!reports[row.universe]) reports[row.universe] = {};
      if (!reports[row.universe][row.marketId]) reports[row.universe][row.marketId] = [];
      const payoutNumerators: Array<string> = ([row.payout0, row.payout1, row.payout2, row.payout3, row.payout4, row.payout5, row.payout6, row.payout7].filter((payout: BigNumber|null): boolean => payout != null) as Array<BigNumber>).map((n) => n.toFixed());
      const report: UIReport<string> = Object.assign(
        formatBigNumberAsFixed<Partial<UIReport<BigNumber>>, Partial<UIReport<string>>>({
          transactionHash: row.transactionHash,
          logIndex: row.logIndex,
          creationBlockNumber: row.creationBlockNumber,
          creationTime: row.creationTime,
          blockHash: row.blockHash,
          marketId: row.marketId,
          feeWindow: row.feeWindow,
          amountStaked: row.amountStaked,
          crowdsourcerId: row.crowdsourcerId,
          isCategorical: row.marketType === "categorical",
          isScalar: row.marketType === "scalar",
          isInvalid: Boolean(row.isInvalid),
          isSubmitted: true,
        }), { payoutNumerators }) as UIReport<string>;

      reports[row.universe][row.marketId].push(report);
    });
    callback(null, reports);
  });
}
