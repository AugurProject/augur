import * as Knex from "knex";
import { JoinedReportsMarketsRow, SortLimitParams, UIReport } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { queryModifierParams } from "./database";
import * as t from "io-ts";

export const ReportingHistoryParamsSpecific = t.type({
  reporter: t.string,
  universe: t.union([t.string, t.null, t.undefined]),
  marketId: t.union([t.string, t.null, t.undefined]),
  feeWindow: t.union([t.string, t.null, t.undefined]),
  earliestCreationTime: t.union([t.number, t.null, t.undefined]),
  latestCreationTime: t.union([t.number, t.null, t.undefined]),
});

export const ReportingHistoryParams = t.intersection([
  ReportingHistoryParamsSpecific,
  SortLimitParams,
]);

export interface UIReports<BigNumberType> {
  [universe: string]: {
    [marketId: string]: {
      crowdsourcers: Array<UIReport<BigNumberType>>;
      initialReporter: UIReport<BigNumberType>|null;
    },
  };
}

// Look up a user's reporting history (i.e., all reports submitted by a given reporter); should take reporter (address) as a required parameter and take market, universe, and feeWindow all as optional parameters. For reporting windows that are complete, should also include the consensus outcome, whether the user's report matched the consensus, how much REP the user gained or lost from redistribution, and how much the user earned in reporting fees.
export async function getReportingHistory(db: Knex, augur: {}, params: t.TypeOf<typeof ReportingHistoryParams>): Promise<UIReports<string>> {
  if (params.universe == null && params.marketId == null && params.feeWindow == null) throw new Error("Must provide reference to universe, specify universe, marketId, or feeWindow");

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
    if (params.universe != null) query.where("universe", params.universe);
    if (params.feeWindow != null) query.where("feeWindow", params.feeWindow);
    if (params.earliestCreationTime != null) query.where("creationTime", ">=", params.earliestCreationTime);
    if (params.latestCreationTime != null) query.where("creationTime", "<=", params.latestCreationTime);
    return query;
  }

  const initialReportQuery = queryParticipantBuilder(db.select([
    "participant.marketId",
    "participant.initialReporter",
    db.raw("'initialReporter' as participantType"),
  ]).from("initial_reports as participant").where("reporter", params.reporter));
  initialReportQuery.join("payouts", "participant.payoutId", "payouts.payoutId");
  initialReportQuery.join("markets", "markets.marketId", "participant.marketId");
  if (params.marketId != null) initialReportQuery.where("participant.marketId", params.marketId);

  const crowdsourcersQuery = queryParticipantBuilder(db.select([
    "crowdsourcers.marketId",
    "participant.crowdsourcerId",
    db.raw("'crowdsourcer' as participantType"),
  ]).from("disputes as participant").where("reporter", params.reporter));
  crowdsourcersQuery.join("crowdsourcers", "participant.crowdsourcerId", "crowdsourcers.crowdsourcerId");
  crowdsourcersQuery.join("markets", "markets.marketId", "crowdsourcers.marketId");
  crowdsourcersQuery.join("payouts", "crowdsourcers.payoutId", "payouts.payoutId");
  if (params.marketId != null) crowdsourcersQuery.where("crowdsourcers.marketId", params.marketId);
  const initialReport = await queryModifierParams<JoinedReportsMarketsRow<BigNumber>>(db, initialReportQuery, "creationBlockNumber", "asc", params);
  const crowdsourcers = await queryModifierParams<JoinedReportsMarketsRow<BigNumber>>(db, crowdsourcersQuery, "creationBlockNumber", "asc", params);
  const reports: UIReports<string> = {};
  const allParticipants = crowdsourcers.concat(initialReport);
  allParticipants.forEach((row: JoinedReportsMarketsRow<BigNumber>): void => {
    if (!reports[row.universe]) reports[row.universe] = {};
    if (!reports[row.universe][row.marketId]) reports[row.universe][row.marketId] = { initialReporter: null, crowdsourcers: [] };
    const payoutNumerators: Array<string> = ([row.payout0, row.payout1, row.payout2, row.payout3, row.payout4, row.payout5, row.payout6, row.payout7].filter((payout: BigNumber|null): boolean => payout != null) as Array<BigNumber>).map((n) => n.toString());
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
  return reports;
}
