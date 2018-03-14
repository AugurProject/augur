import * as Knex from "knex";
import * as _ from "lodash";
import BigNumber from "bignumber.js";
import { sortDirection } from "../../utils/sort-direction";
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

export function reshapeOutcomesRowToUIOutcomeInfo(outcomesRow: OutcomesRow): UIOutcomeInfo {
  return {
    id: outcomesRow.outcome,
    volume: outcomesRow.volume,
    price: outcomesRow.price,
    description: outcomesRow.description,
  };
}

export function reshapeMarketsRowToUIMarketInfo(row: MarketsRowWithCreationTime, outcomesInfo: Array<UIOutcomeInfo>, winningPayoutRow: PayoutRow|null): UIMarketInfo {
  let consensus: NormalizedPayout|null;
  if (winningPayoutRow == null) {
    consensus = null;
  } else {
    consensus = normalizePayouts(winningPayoutRow);
  }
  return {
    id: row.marketId,
    universe: row.universe,
    marketType: row.marketType,
    numOutcomes: row.numOutcomes,
    minPrice: row.minPrice.toFixed(),
    maxPrice: row.maxPrice.toFixed(),
    cumulativeScale: row.maxPrice.minus(row.minPrice).toFixed(),
    author: row.marketCreator,
    creationTime: row.creationTime,
    creationBlock: row.creationBlockNumber,
    creationFee: row.creationFee.toFixed(),
    settlementFee: row.reportingFeeRate.plus(row.marketCreatorFeeRate).toFixed(),
    reportingFeeRate: row.reportingFeeRate.toFixed(),
    marketCreatorFeeRate: row.marketCreatorFeeRate.toFixed(),
    marketCreatorFeesCollected: row.marketCreatorFeesCollected!.toFixed(),
    initialReportSize: row.initialReportSize!.toFixed(),
    category: row.category,
    tags: [row.tag1, row.tag2],
    volume: row.volume.toFixed(),
    outstandingShares: row.sharesOutstanding.toFixed(),
    feeWindow: row.feeWindow,
    endDate: row.endTime,
    finalizationTime: row.finalizationTime,
    reportingState: row.reportingState,
    description: row.shortDescription,
    extraInfo: row.longDescription,
    designatedReporter: row.designatedReporter,
    designatedReportStake: row.designatedReportStake!.toString(),
    resolutionSource: row.resolutionSource,
    numTicks: row.numTicks.toFixed(),
    tickSize: numTicksToTickSize(row.numTicks, row.minPrice, row.maxPrice).toFixed(),
    consensus,
    outcomes: outcomesInfo,
  };
}

export function reshapeDisputeTokensRowToUIDisputeTokenInfo(disputeTokenRow: DisputeTokensRowWithTokenState): UIDisputeTokenInfo {
  return Object.assign(_.omit(disputeTokenRow, ["payoutId", "winning"]) as DisputeTokensRowWithTokenState, {
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

export function normalizePayouts(payoutRow: PayoutRow): NormalizedPayout {
  const payout = [];
  for (let i = 0; i < 8; i++) {
    const payoutNumerator = payoutRow["payout" + i as keyof PayoutRow];
    if (payoutNumerator == null) break;
    payout.push(payoutNumerator);
  }
  return Object.assign(
    {},
    { payout } as NormalizedPayoutNumerators,
    { isInvalid: !!payoutRow.isInvalid },
  );
}
