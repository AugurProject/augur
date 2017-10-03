import { Database } from "sqlite3";
import { MarketsRow, MarketInfo } from "./types";

export function getMarketInfo(db: Database, market: string, callback: (err?: Error|null, result?: MarketInfo) => void) {
  db.get(`SELECT * FROM markets WHERE contract_address = ?`, [market], (err?: Error|null, row?: MarketsRow) => {
    if (err) return callback(err);
    if (!row) return callback(null);
    const marketInfo: MarketInfo = {
      contractAddress: row.contract_address,
      universe: row.universe,
      marketType: row.market_type,
      numOutcomes: row.num_outcomes,
      minPrice: row.min_price,
      maxPrice: row.max_price,
      marketCreator: row.market_creator,
      creationTime: row.creation_time,
      creationBlockNumber: row.creation_block_number,
      creationFee: row.creation_fee,
      marketCreatorFeeRate: row.market_creator_fee_rate,
      marketCreatorFeesCollected: row.market_creator_fees_collected,
      topic: row.topic,
      tag1: row.tag1,
      tag2: row.tag2,
      volume: row.volume,
      sharesOutstanding: row.shares_outstanding,
      reportingWindow: row.reporting_window,
      endTime: row.end_time,
      finalizationTime: row.finalization_time,
      shortDescription: row.short_description,
      longDescription: row.long_description,
      designatedReporter: row.designated_reporter,
      resolutionSource: row.resolution_source
    };
    callback(null, marketInfo);
  });
}
