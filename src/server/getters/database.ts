import * as Knex from "knex";
import BigNumber from "bignumber.js";
import { sortDirection } from "../../utils/sort-direction";
import { MarketsRowWithCreationTime, OutcomesRow, UIMarketInfo, UIConsensusInfo, UIOutcomeInfo, StakeTokensRowWithReportingState, UIStakeTokenInfo } from "../../types";
import { convertNumTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";

export function queryModifier(query: Knex.QueryBuilder, defaultSortBy: string, defaultSortOrder: string, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined): Knex.QueryBuilder {
  query = query.orderBy(sortBy || defaultSortBy, sortDirection(isSortDescending, defaultSortOrder));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  return query;
}

export function reshapeOutcomesRowToUIOutcomeInfo(outcomesRow: OutcomesRow): UIOutcomeInfo {
  const outcomeInfo: UIOutcomeInfo = {
    id: outcomesRow.outcome,
    volume: outcomesRow.volume,
    price: outcomesRow.price,
    description: outcomesRow.description,
  };
  return outcomeInfo;
}

export function reshapeMarketsRowToUIMarketInfo(row: MarketsRowWithCreationTime, outcomesInfo: Array<UIOutcomeInfo>): UIMarketInfo {
  let consensus: UIConsensusInfo|null;
  console.log(row);
  if (row.consensusPayoutID === null) {
    consensus = null;
  } else {
    consensus = { outcomeID: row.consensusPayoutID, isInvalid: row.isInvalid } as UIConsensusInfo;
  }
  const marketInfo: UIMarketInfo = {
    id: row.marketID,
    universe: row.universe,
    marketType: row.marketType,
    numOutcomes: row.numOutcomes,
    minPrice: row.minPrice,
    maxPrice: row.maxPrice,
    cumulativeScale: new BigNumber(row.maxPrice, 10).minus(new BigNumber(row.minPrice, 10)).toFixed(),
    author: row.marketCreator,
    creationTime: row.creationTime,
    creationBlock: row.creationBlockNumber,
    creationFee: row.creationFee,
    settlementFee: new BigNumber(row.reportingFeeRate, 10).plus(new BigNumber(row.marketCreatorFeeRate, 10)).toFixed(),
    reportingFeeRate: row.reportingFeeRate,
    marketCreatorFeeRate: row.marketCreatorFeeRate,
    marketCreatorFeesCollected: row.marketCreatorFeesCollected,
    category: row.category,
    tags: [row.tag1, row.tag2],
    volume: row.volume,
    outstandingShares: row.sharesOutstanding,
    reportingWindow: row.reportingWindow,
    endDate: row.endTime,
    finalizationTime: row.finalizationTime,
    reportingState: row.reportingState,
    description: row.shortDescription,
    extraInfo: row.longDescription,
    designatedReporter: row.designatedReporter,
    designatedReportStake: row.designatedReportStake,
    resolutionSource: row.resolutionSource,
    numTicks: row.numTicks,
    tickSize: convertNumTicksToTickSize(row.numTicks, row.minPrice, row.maxPrice),
    consensus,
    outcomes: outcomesInfo,
  };
  return marketInfo;
}

export function reshapeStakeTokensRowToUIStakeTokenInfo(stakeTokenRow: StakeTokensRowWithReportingState): UIStakeTokenInfo {
  const stakeTokenInfo: UIStakeTokenInfo = Object.assign(stakeTokenRow, {
      isInvalid: !!stakeTokenRow.isInvalid,
      claimed: !!stakeTokenRow.claimed,
      winningToken: (stakeTokenRow.winningToken == null) ? null : !!stakeTokenRow.winningToken,
  });
  return stakeTokenInfo;
}

export function getMarketsWithReportingState(db: Knex, selectColumns?: Array<string>): Knex.QueryBuilder {
  // TODO: turn leftJoin() into join() once we take care of market_state on market creation
  const columns = selectColumns ? selectColumns.slice() : ["markets.*", "market_state.reportingState as reportingState", "blocks.timestamp as creationTime"];
  return db.select(columns)
    .from("markets")
    .leftJoin("market_state", "markets.marketStateID", "market_state.marketStateID")
    .leftJoin("blocks", "markets.creationBlockNumber", "blocks.blockNumber");
}
