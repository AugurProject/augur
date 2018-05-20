import * as Knex from "knex";
import { Address, AsyncCallback, JoinedReportsMarketsRow, UIReport } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { queryModifier } from "./database";
import { parallel } from "async";

export interface UIReports<BigNumberType> {
  [universe: string]: {
    [marketId: string]: {
      crowdsourcers: Array<UIReport<BigNumberType>>;
      initialReporter: UIReport<BigNumberType>|null;
    },
  };
}

interface ParticipantResults<BigNumberType> {
  initialReport: Array<JoinedReportsMarketsRow<BigNumberType>>;
  crowdsourcers: Array<JoinedReportsMarketsRow<BigNumberType>>;

}

// Look up a user's reporting history (i.e., all reports submitted by a given reporter); should take reporter (address) as a required parameter and take market, universe, and feeWindow all as optional parameters. For reporting windows that are complete, should also include the consensus outcome, whether the user's report matched the consensus, how much REP the user gained or lost from redistribution, and how much the user earned in reporting fees.
export function getReportingHistory(db: Knex, reporter: Address, universe: Address|null, marketId: Address|null, feeWindow: Address|null, earliestCreationTime: number|null, latestCreationTime: number|null, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: UIReports<string>) => void): void {
  if (universe == null && marketId == null && feeWindow == null) return callback(new Error("Must provide reference to universe, specify universe, marketId, or feeWindow"));
  function queryParticipantBuilder(query: Knex.QueryBuilder): Knex.QueryBuilder {
    query.select([
      "participant.transactionHash",
      "participant.logIndex",
      "participant.blockNumber as creationBlockNumber",
      "blocks.blockHash",
      "blocks.timestamp as creationTime",
      "markets.universe",
      "markets.feeWindow",
      "participant.amountStaked",
      "payouts.isInvalid",
      "payouts.payout0",
      "payouts.payout1",
      "payouts.payout2",
      "payouts.payout3",
      "payouts.payout4",
      "payouts.payout5",
      "payouts.payout6",
      "payouts.payout7",
    ]);
    query.join("blocks", "blocks.blockNumber", "participant.blockNumber");
    if (universe != null) query.where("universe", universe);
    if (feeWindow != null) query.where("feeWindow", feeWindow);
    if (earliestCreationTime != null) query.where("creationTime", ">=", earliestCreationTime);
    if (latestCreationTime != null) query.where("creationTime", "<=", latestCreationTime);
    return query;
  }

  const initialReportQuery = queryParticipantBuilder(db.select([
    "participant.marketId",
    "participant.initialReporter",
    db.raw("'initialReporter' as participantType"),
  ]).from("initial_reports as participant").where({reporter}));
  initialReportQuery.join("payouts", "participant.payoutId", "payouts.payoutId");
  initialReportQuery.join("markets", "markets.marketId", "participant.marketId");
  if (marketId != null) initialReportQuery.where("participant.marketId", marketId);

  const crowdsourcersQuery = queryParticipantBuilder(db.select([
    "crowdsourcers.marketId",
    "participant.crowdsourcerId",
    db.raw("'crowdsourcer' as participantType"),
  ]).from("disputes as participant").where({reporter}));
  crowdsourcersQuery.join("crowdsourcers", "participant.crowdsourcerId", "crowdsourcers.crowdsourcerId");
  crowdsourcersQuery.join("markets", "markets.marketId", "crowdsourcers.marketId");
  crowdsourcersQuery.join("payouts", "crowdsourcers.payoutId", "payouts.payoutId");
  if (marketId != null) crowdsourcersQuery.where("crowdsourcers.marketId", marketId);
  parallel({
    initialReport: (next: AsyncCallback) => queryModifier(db, initialReportQuery, "creationBlockNumber", "asc", sortBy, isSortDescending, limit, offset, next),
    crowdsourcers: (next: AsyncCallback) => queryModifier(db, crowdsourcersQuery, "creationBlockNumber", "asc", sortBy, isSortDescending, limit, offset, next),
  }, (err: Error|null, participantResults: ParticipantResults<BigNumber>): void => {
    if (err) return callback(err);
    if (!participantResults) return callback(new Error("Internal error retrieving reporting history"));
    const reports: UIReports<string> = {};
    const allParticipants = participantResults.crowdsourcers.concat(participantResults.initialReport);
    allParticipants.forEach((row: JoinedReportsMarketsRow<BigNumber>): void => {
      if (!reports[row.universe]) reports[row.universe] = {};
      if (!reports[row.universe][row.marketId]) reports[row.universe][row.marketId] = {initialReporter: null, crowdsourcers: []};
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
          isCategorical: row.marketType === "categorical",
          isScalar: row.marketType === "scalar",
          isInvalid: Boolean(row.isInvalid),
          isSubmitted: true,
        }), { payoutNumerators }) as UIReport<string>;
      if (row.participantType === "initialReporter") {
        reports[row.universe][row.marketId].initialReporter = Object.assign({
          initialReporter: row.initialReporter,
        }, report);
      } else if (row.participantType === "crowdsourcer") {
        reports[row.universe][row.marketId].crowdsourcers.push(Object.assign({
          crowdsourcerId: row.crowdsourcerId,
        }, report));
      }
    });
    callback(null, reports);
  });
}
