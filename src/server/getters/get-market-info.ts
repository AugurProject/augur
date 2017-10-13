import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, MarketsRow, OutcomesRow, UIMarketInfo, UIConsensusInfo, UIOutcomeInfo } from "../../types";

export function reshapeOutcomesRowToUIOutcomeInfo(outcomesRow: OutcomesRow): UIOutcomeInfo {
  const outcomeInfo: UIOutcomeInfo = {
    id: outcomesRow.outcome,
    outstandingShares: outcomesRow.shares_outstanding,
    price: outcomesRow.price
  };
  return outcomeInfo;
}

export function reshapeMarketsRowToUIMarketInfo(row: MarketsRow, outcomesInfo: Array<UIOutcomeInfo>): UIMarketInfo {
  let consensus: UIConsensusInfo|null;
  if (row.consensus_outcome === null) {
    consensus = null;
  } else {
    consensus = { outcomeID: row.consensus_outcome, isIndeterminate: row.is_invalid } as UIConsensusInfo;
  }
  const marketInfo: UIMarketInfo = {
    id: row.market_id,
    branchID: row.universe,
    type: row.market_type,
    numOutcomes: row.num_outcomes,
    minPrice: row.min_price,
    maxPrice: row.max_price,
    cumulativeScale: new BigNumber(row.max_price, 10).minus(new BigNumber(row.min_price, 10)).toFixed(),
    author: row.market_creator,
    creationTime: row.creation_time,
    creationBlock: row.creation_block_number,
    creationFee: row.creation_fee,
    marketCreatorFeeRate: row.market_creator_fee_rate,
    marketCreatorFeesCollected: row.market_creator_fees_collected,
    category: row.category,
    tags: [row.tag1, row.tag2],
    volume: row.volume,
    outstandingShares: row.shares_outstanding,
    reportingWindow: row.reporting_window,
    endDate: row.end_time,
    finalizationTime: row.finalization_time,
    description: row.short_description,
    extraInfo: row.long_description,
    designatedReporter: row.designated_reporter,
    designatedReportStake: row.designated_report_stake,
    resolutionSource: row.resolution_source,
    numTicks: row.num_ticks,
    consensus,
    outcomes: outcomesInfo
  };
  return marketInfo;
}

export function getMarketInfo(db: Knex, marketID: string, callback: (err?: Error|null, result?: UIMarketInfo) => void): void {
  db.raw("SELECT * FROM markets WHERE market_id = ? LIMIT 1", [marketID]).asCallback((err?: Error|null, rows?: Array<MarketsRow>): void => {
    if (err) return callback(err);
    if (!rows || rows.length === 0) return callback(null);
    const marketsRow: MarketsRow = rows[0];
    db.raw("SELECT * FROM outcomes WHERE market_id = ?", [marketID]).asCallback((err?: Error|null, outcomesRows?: Array<OutcomesRow>): void => {
      if (err) return callback(err);
      const outcomesInfo: Array<UIOutcomeInfo> = outcomesRows!.map((outcomesRow: OutcomesRow): UIOutcomeInfo => reshapeOutcomesRowToUIOutcomeInfo(outcomesRow));
      callback(null, reshapeMarketsRowToUIMarketInfo(marketsRow, outcomesInfo));
    });
  });
}
