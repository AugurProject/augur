import { Database } from "sqlite3";
import { Address } from "../../types";

interface MarketsRow {
  contract_address: Address,
  universe: Address,
  market_type: string,
  num_outcomes: number,
  min_price: number,
  max_price: number,
  market_creator: Address,
  creation_time: number,
  creation_block_number: number,
  creation_fee: number,
  market_creator_fee_rate: number,
  market_creator_fees_collected: number|null,
  topic: string,
  tag1: string|null,
  tag2: string|null,
  volume: number,
  shares_outstanding: number,
  reporting_window: Address,
  end_time: number,
  finalization_time: number|null,
  short_description: string,
  long_description: string|null,
  designated_reporter: Address,
  resolution_source: string|null
}

interface MarketInfo {
  contractAddress: Address,
  universe: Address,
  marketType: string,
  numOutcomes: number,
  minPrice: number,
  maxPrice: number,
  marketCreator: Address,
  creationTime: number,
  creationBlockNumber: number,
  creationFee: number,
  marketCreatorFeeRate: number,
  marketCreatorFeesCollected: number|null,
  topic: string,
  tag1: string|null,
  tag2: string|null,
  volume: number,
  sharesOutstanding: number,
  reportingWindow: Address,
  endTime: number,
  finalizationTime: number|null,
  shortDescription: string,
  longDescription: string|null,
  designatedReporter: Address,
  resolutionSource: string|null
}

export function getMarketInfo(db: Database, market: string, callback: (err?: Error|null, result?: MarketInfo) => void): void {
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
