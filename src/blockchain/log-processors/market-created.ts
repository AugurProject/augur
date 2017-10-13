import { parallel } from "async";
import Augur = require("augur.js");
import * as Knex from "knex";
import { FormattedLog, MarketCreatedLogExtraInfo, MarketCreatedOnContractInfo, ErrorCallback, AsyncCallback } from "../../types";

export function processMarketCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  trx.raw("SELECT block_timestamp FROM blocks WHERE block_number = ?", [log.blockNumber]).asCallback((err?: Error|null, blocksRow?: {block_timestamp: number}): void => {
    if (err) return callback(err);
    if (!blocksRow) return callback(new Error("block timestamp not found"));
    const marketPayload: {} = { tx: { to: log.address } };
    parallel({
      numberOfOutcomes: (next: AsyncCallback) => augur.api.Market.getNumberOfOutcomes(marketPayload, next),
      reportingWindow: (next: AsyncCallback) => augur.api.Market.getReportingWindow(marketPayload, next),
      endTime: (next: AsyncCallback) => augur.api.Market.getEndTime(marketPayload, next),
      designatedReporter: (next: AsyncCallback) => augur.api.Market.getDesignatedReporter(marketPayload, next),
      designatedReportStake: (next: AsyncCallback) => augur.api.Market.getDesignatedReportStake(marketPayload, next),
      numTicks: (next: AsyncCallback) => augur.api.Market.getNumTicks(marketPayload, next)
    }, (err?: any, onContractData?: any): void => {
      if (err) return callback(err);
      const extraInfo: MarketCreatedLogExtraInfo = log.extraInfo;
      const dataToInsert: {} = {
        market_id:                     log.market,
        universe:                      log.address,
        market_creator:                log.marketCreator,
        creation_time:                 blocksRow.block_timestamp,
        creation_block_number:         log.blockNumber,
        creation_fee:                  log.marketCreationFee,
        market_creator_fees_collected: "0",
        market_type:                   extraInfo!.marketType,
        min_price:                     extraInfo!.minPrice,
        max_price:                     extraInfo!.maxPrice,
        category:                         extraInfo!.category,
        tag1:                          extraInfo!.tag1,
        tag2:                          extraInfo!.tag2,
        short_description:             extraInfo!.shortDescription,
        long_description:              extraInfo!.longDescription,
        resolution_source:             extraInfo!.resolutionSource,
        num_outcomes:                  parseInt(onContractData!.numberOfOutcomes!, 16),
        market_creator_fee_rate:       onContractData!.marketCreatorFeeRate,
        reporting_window:              onContractData!.reportingWindow,
        end_time:                      parseInt(onContractData!.endTime!, 16),
        designated_reporter:           onContractData!.designatedReporter,
        designated_report_stake:       onContractData!.designatedReportStake,
        num_ticks:                     parseInt(onContractData!.numTicks!, 16)
      };
      db.transacting(trx).insert(dataToInsert).into("markets").asCallback((err?: Error|null): void => {
        if (err) return callback(err);
        trx.raw(`SELECT popularity FROM categories WHERE category = ?`, [log.category]).asCallback((err?: Error|null, row?: {popularity: number}): void => {
          if (err) return callback(err);
          if (row) return callback(null);
          db.transacting(trx).insert({category: log.category, universe: log.address}).into("categories").asCallback(callback);
        });
      });
    });
  });
}
