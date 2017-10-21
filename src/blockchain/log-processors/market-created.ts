import { parallel } from "async";
import Augur = require("augur.js");
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, Int256, FormattedLog, MarketCreatedLogExtraInfo, MarketCreatedOnContractInfo, ErrorCallback, AsyncCallback } from "../../types";
import { convertDivisorToRate } from "../../utils/convert-divisor-to-rate";

interface MarketCreatedOnContractData {
  numberOfOutcomes: Int256;
  reportingWindow: Address;
  endTime: Int256;
  designatedReporter: Address;
  designatedReportStake: Int256;
  numTicks: Int256;
  marketCreatorSettlementFeeDivisor: Int256;
}

export function processMarketCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  trx.select("blockTimestamp").from("blocks").where({ blockNumber: log.blockNumber }).asCallback((err?: Error|null, blocksRow?: {blockTimestamp: number}): void => {
    if (err) return callback(err);
    if (!blocksRow) return callback(new Error("block timestamp not found"));
    const marketPayload: {} = { tx: { to: log.market } };
    parallel({
      numberOfOutcomes: (next: AsyncCallback): void => augur.api.Market.getNumberOfOutcomes(marketPayload, next),
      reportingWindow: (next: AsyncCallback): void => augur.api.Market.getReportingWindow(marketPayload, next),
      endTime: (next: AsyncCallback): void => augur.api.Market.getEndTime(marketPayload, next),
      designatedReporter: (next: AsyncCallback): void => augur.api.Market.getDesignatedReporter(marketPayload, next),
      designatedReportStake: (next: AsyncCallback): void => augur.api.Market.getDesignatedReportStake(marketPayload, next),
      numTicks: (next: AsyncCallback): void => augur.api.Market.getNumTicks(marketPayload, next),
      universe: (next: AsyncCallback): void => augur.api.Market.getUniverse(marketPayload, next),
      marketCreatorSettlementFeeDivisor: (next: AsyncCallback): void => augur.api.Market.getMarketCreatorSettlementFeeDivisor(marketPayload, next)
    }, (err?: any, onContractData?: any): void => {
      if (err) return callback(err);
      const universePayload: {} = { tx: { to: onContractData.universe } };
      augur.api.Universe.getReportingFeeDivisor(universePayload, (err: Error|null, reportingFeeDivisor?: string): void => {
        const extraInfo: MarketCreatedLogExtraInfo = log.extraInfo;
        const dataToInsert: {} = {
          marketID:                   log.market,
          marketCreator:              log.marketCreator,
          creationTime:               blocksRow.blockTimestamp,
          creationBlockNumber:        log.blockNumber,
          creationFee:                log.marketCreationFee,
          marketCreatorFeesCollected: "0",
          marketType:                 extraInfo!.marketType,
          minPrice:                   extraInfo!.minPrice,
          maxPrice:                   extraInfo!.maxPrice,
          category:                   extraInfo!.category,
          tag1:                       extraInfo!.tag1,
          tag2:                       extraInfo!.tag2,
          shortDescription:           extraInfo!.shortDescription,
          longDescription:            extraInfo!.longDescription,
          resolutionSource:           extraInfo!.resolutionSource,
          universe:                   onContractData!.universe,
          numOutcomes:                parseInt(onContractData!.numberOfOutcomes!, 16),
          reportingWindow:            onContractData!.reportingWindow,
          endTime:                    parseInt(onContractData!.endTime!, 16),
          designatedReporter:         onContractData!.designatedReporter,
          designatedReportStake:      onContractData!.designatedReportStake,
          numTicks:                   parseInt(onContractData!.numTicks!, 16),
          marketCreatorFeeRate:       convertDivisorToRate(onContractData!.marketCreatorSettlementFeeDivisor!, 16),
          reportingFeeRate:           convertDivisorToRate(reportingFeeDivisor!, 16)
        };
        db.transacting(trx).insert(dataToInsert).into("markets").asCallback((err?: Error|null): void => {
          if (err) return callback(err);
          trx.select("popularity").from("categories").where({ category: log.category }).asCallback((err?: Error|null, row?: {popularity: number}): void => {
            if (err) return callback(err);
            if (row) return callback(null);
            db.transacting(trx).insert({ category: log.category, universe: log.address }).into("categories").asCallback(callback);
          });
        });
      });
    });
  });
}
