import { parallel } from "async";
import Augur = require("augur.js");
import * as Knex from "knex";
import { FormattedLog, MarketCreatedLogExtraInfo, MarketCreatedOnContractInfo, ErrorCallback, AsyncCallback } from "../../types";

export function processMarketCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  trx.raw("SELECT blockTimestamp FROM blocks WHERE blockNumber = ?", [log.blockNumber]).asCallback((err?: Error|null, blocksRow?: {blockTimestamp: number}): void => {
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
        marketID:                     log.market,
        universe:                     log.address,
        marketCreator:                log.marketCreator,
        creationTime:                 blocksRow.blockTimestamp,
        creationBlockNumber:          log.blockNumber,
        creationFee:                  log.marketCreationFee,
        marketCreatorFeesCollected:   "0",
        marketType:                   extraInfo!.marketType,
        minPrice:                     extraInfo!.minPrice,
        maxPrice:                     extraInfo!.maxPrice,
        category:                     extraInfo!.category,
        tag1:                         extraInfo!.tag1,
        tag2:                         extraInfo!.tag2,
        shortDescription:             extraInfo!.shortDescription,
        longDescription:              extraInfo!.longDescription,
        resolutionSource:             extraInfo!.resolutionSource,
        numOutcomes:                  parseInt(onContractData!.numberOfOutcomes!, 16),
        marketCreatorFeeRate:         onContractData!.marketCreatorFeeRate,
        reportingWindow:              onContractData!.reportingWindow,
        endTime:                      parseInt(onContractData!.endTime!, 16),
        designatedReporter:           onContractData!.designatedReporter,
        designatedReportStake:        onContractData!.designatedReportStake,
        numTicks:                     parseInt(onContractData!.numTicks!, 16)
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
