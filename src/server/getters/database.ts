import * as Knex from "knex";
import * as _ from "lodash";
import BigNumber from "bignumber.js";
import { sortDirection } from "../../utils/sort-direction";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import {
  MarketsRowWithCreationTime,
  OutcomesRow,
  UIMarketInfo,
  UIOutcomeInfo,
  DisputeTokensRowWithTokenState,
  UIDisputeTokenInfo,
  PayoutRow,
  NormalizedPayout,
  NormalizedPayoutNumerators,
} from "../../types";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";

export function queryModifier(query: Knex.QueryBuilder, defaultSortBy: string, defaultSortOrder: string, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined): Knex.QueryBuilder {
  query = query.orderBy(sortBy || defaultSortBy, sortDirection(isSortDescending, defaultSortOrder));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  return query;
}

export function reshapeOutcomesRowToUIOutcomeInfo(outcomesRow: OutcomesRow<BigNumber>): UIOutcomeInfo<BigNumber> {
  return {
    id: outcomesRow.outcome,
    volume: outcomesRow.volume,
    price: outcomesRow.price,
    description: outcomesRow.description,
  };
}

export function reshapeMarketsRowToUIMarketInfo(row: MarketsRowWithCreationTime, outcomesInfo: Array<UIOutcomeInfo<BigNumber>>, winningPayoutRow: PayoutRow<BigNumber>|null): UIMarketInfo<string> {
  let consensus: NormalizedPayout<BigNumber>|null;
  if (winningPayoutRow == null) {
    consensus = null;
  } else {
    consensus = normalizePayouts(winningPayoutRow);
  }
  return formatBigNumberAsFixed<UIMarketInfo<BigNumber>, UIMarketInfo<string>>({
    id: row.marketId,
    universe: row.universe,
    marketType: row.marketType,
    numOutcomes: row.numOutcomes,
    minPrice: row.minPrice,
    maxPrice: row.maxPrice,
    cumulativeScale: row.maxPrice.minus(row.minPrice),
    author: row.marketCreator,
    creationTime: row.creationTime,
    creationBlock: row.creationBlockNumber,
    creationFee: row.creationFee,
    settlementFee: row.reportingFeeRate.plus(row.marketCreatorFeeRate),
    reportingFeeRate: row.reportingFeeRate,
    marketCreatorFeeRate: row.marketCreatorFeeRate,
    marketCreatorFeesCollected: row.marketCreatorFeesCollected!,
    initialReportSize: row.initialReportSize,
    category: row.category,
    tags: [row.tag1, row.tag2],
    volume: row.volume,
    outstandingShares: row.sharesOutstanding,
    feeWindow: row.feeWindow,
    endDate: row.endTime,
    finalizationTime: row.finalizationTime,
    reportingState: row.reportingState,
    description: row.shortDescription,
    details: row.longDescription,
    scalarDenomination: row.scalarDenomination,
    designatedReporter: row.designatedReporter,
    designatedReportStake: row.designatedReportStake!,
    resolutionSource: row.resolutionSource,
    numTicks: row.numTicks,
    tickSize: numTicksToTickSize(row.numTicks, row.minPrice, row.maxPrice),
    consensus,
    outcomes: _.map(outcomesInfo, (outcomeInfo) => formatBigNumberAsFixed<UIOutcomeInfo<BigNumber>, UIOutcomeInfo<string>>(outcomeInfo)),
  });
}

export function reshapeDisputeTokensRowToUIDisputeTokenInfo(disputeTokenRow: DisputeTokensRowWithTokenState<BigNumber>): UIDisputeTokenInfo<BigNumber> {
  return Object.assign(_.omit(disputeTokenRow, ["payoutId", "winning"]) as DisputeTokensRowWithTokenState<BigNumber>, {
    isInvalid: !!disputeTokenRow.isInvalid,
    claimed: !!disputeTokenRow.claimed,
    winningToken: (disputeTokenRow.winning == null) ? null : !!disputeTokenRow.winning,
  });
}

export function getMarketsWithReportingState(db: Knex, selectColumns?: Array<string>): Knex.QueryBuilder {
  // TODO: turn leftJoin() into join() once we take care of market_state on market creation
  const columns = selectColumns ? selectColumns.slice() : ["markets.*", "market_state.reportingState as reportingState", "blocks.timestamp as creationTime"];
  return db.select(columns)
    .from("markets")
    .leftJoin("market_state", "markets.marketStateId", "market_state.marketStateId")
    .leftJoin("blocks", "markets.creationBlockNumber", "blocks.blockNumber");
}

export function normalizePayouts(payoutRow: PayoutRow<BigNumber>): NormalizedPayout<BigNumber> {
  const payout = [];
  for (let i = 0; i < 8; i++) {
    const payoutNumerator = payoutRow["payout" + i as keyof PayoutRow<BigNumber>];
    if (payoutNumerator == null) break;
    payout.push(payoutNumerator);
  }
  return Object.assign(
    {},
    { payout } as NormalizedPayoutNumerators<BigNumber>,
    { isInvalid: !!payoutRow.isInvalid },
  );
}
