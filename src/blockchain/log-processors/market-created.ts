import { forEachOf, parallel } from "async";
import Augur from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, Int256, FormattedEventLog, MarketCreatedLogExtraInfo, MarketCreatedOnContractInfo, MarketsRow, OutcomesRow, TokensRow, CategoriesRow, ErrorCallback, AsyncCallback } from "../../types";
import { convertDivisorToRate } from "../../utils/convert-divisor-to-rate";
import { augurEmitter } from "../../events";

export function processMarketCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const marketPayload: {} = { tx: { to: log.market } };
  parallel({
    numberOfOutcomes: (next: AsyncCallback): void => augur.api.Market.getNumberOfOutcomes(marketPayload, next),
    feeWindow: (next: AsyncCallback): void => augur.api.Market.getFeeWindow(marketPayload, next),
    endTime: (next: AsyncCallback): void => augur.api.Market.getEndTime(marketPayload, next),
    designatedReporter: (next: AsyncCallback): void => augur.api.Market.getDesignatedReporter(marketPayload, next),
    numTicks: (next: AsyncCallback): void => augur.api.Market.getNumTicks(marketPayload, next),
    universe: (next: AsyncCallback): void => augur.api.Market.getUniverse(marketPayload, next),
    marketCreatorSettlementFeeDivisor: (next: AsyncCallback): void => augur.api.Market.getMarketCreatorSettlementFeeDivisor(marketPayload, next),
  }, (err?: any, onMarketContractData?: any): void => {
    if (err) return callback(err);
    const universePayload: {} = { tx: { to: onMarketContractData.universe, send: false } };
    parallel({
      reportingFeeDivisor: (next: AsyncCallback): void => augur.api.Universe.getOrCacheReportingFeeDivisor(universePayload, next),
      designatedReportStake: (next: AsyncCallback): void => augur.api.Universe.getOrCacheDesignatedReportStake(universePayload, next),
    }, (err?: any, onUniverseContractData?: any): void => {
      if (err) return callback(err);
      const marketStateDataToInsert: { [index: string]: string|number|boolean } = {
        marketID: log.market,
        reportingState: augur.constants.REPORTING_STATE.PRE_REPORTING,
        blockNumber: log.blockNumber,
      };
      db.transacting(trx).insert(marketStateDataToInsert).returning("marketStateID").into("market_state").asCallback((err: Error|null, marketStateRow?: Array<number>): void => {
        if (err) return callback(err);
        if (!marketStateRow || !marketStateRow.length) return callback(new Error("No market state ID"));
        const marketStateID = marketStateRow[0];
        const extraInfo: MarketCreatedLogExtraInfo = (log.extraInfo != null && typeof log.extraInfo === "object") ? log.extraInfo : {};
        const numOutcomes = parseInt(onMarketContractData!.numberOfOutcomes!, 10);
        const marketType: string = ["binary", "categorical", "scalar"][log.marketType];
        const marketsDataToInsert: MarketsRow = {
          marketType,
          marketID:                   log.market,
          marketCreator:              log.marketCreator,
          creationBlockNumber:        log.blockNumber,
          creationFee:                log.marketCreationFee,
          category:                   log.topic,
          shortDescription:           log.description,
          minPrice:                   log.minPrice,
          maxPrice:                   log.maxPrice,
          tag1:                       (extraInfo!.tags && extraInfo!.tags!.length) ? extraInfo!.tags![0] : null,
          tag2:                       (extraInfo!.tags && extraInfo!.tags!.length > 1) ? extraInfo!.tags![1] : null,
          longDescription:            extraInfo!.longDescription || null,
          resolutionSource:           extraInfo!.resolutionSource || null,
          universe:                   onMarketContractData!.universe,
          numOutcomes,
          marketStateID,
          reportingWindow:            onMarketContractData!.feeWindow, // TODO update db to use "fee window" instead of "reporting window"
          endTime:                    parseInt(onMarketContractData!.endTime!, 10),
          designatedReporter:         onMarketContractData!.designatedReporter,
          designatedReportStake:      onUniverseContractData!.designatedReportStake,
          numTicks:                   onMarketContractData!.numTicks,
          marketCreatorFeeRate:       convertDivisorToRate(onMarketContractData!.marketCreatorSettlementFeeDivisor!, 10),
          reportingFeeRate:           convertDivisorToRate(onUniverseContractData!.reportingFeeDivisor!, 10),
          marketCreatorFeesCollected: "0",
          volume:                     "0",
          sharesOutstanding:          "0",
        };
        const outcomesDataToInsert: Partial<OutcomesRow> = {
          marketID: log.market,
          price: new BigNumber(log.minPrice, 10).plus(new BigNumber(log.maxPrice, 10)).dividedBy(new BigNumber(numOutcomes, 10)).toFixed(),
          volume: "0",
        };
        const tokensDataToInsert: Partial<TokensRow> = {
          marketID: log.market,
          symbol: "shares",
        };
        const shareTokens = new Array(numOutcomes);
        forEachOf(shareTokens, (_: null, outcome: number, nextOutcome: ErrorCallback): void => {
          augur.api.Market.getShareToken(Object.assign({ _outcome: outcome }, marketPayload), (err: Error|null, shareToken?: Address): void => {
            if (err) return nextOutcome(err);
            shareTokens[outcome] = shareToken;
            nextOutcome();
          });
        }, (err: Error|null): void => {
          if (err) return callback(err);
          const outcomeNames: Array<string|number|null> = (log.marketType === "1" && log!.outcomes) ? log!.outcomes! : new Array(numOutcomes).fill(null);
          parallel([
            (next: AsyncCallback): void => {
              db.transacting(trx).insert(marketsDataToInsert).into("markets").asCallback(next);
            },
            (next: AsyncCallback): void => {
              db.batchInsert("outcomes", shareTokens.map((_: Address, outcome: number): Partial<OutcomesRow> => Object.assign({ outcome, description: outcomeNames[outcome] }, outcomesDataToInsert)), numOutcomes).transacting(trx).asCallback(next);
            },
            (next: AsyncCallback): void => {
              db.batchInsert("tokens", shareTokens.map((contractAddress: Address, outcome: number): Partial<TokensRow> => Object.assign({ contractAddress, outcome }, tokensDataToInsert)), numOutcomes).transacting(trx).asCallback(next);
            },
          ], (err: Error|null): void => {
            if (err) return callback(err);
            augurEmitter.emit("MarketCreated", marketsDataToInsert);
            trx.select("popularity").from("categories").where({ category: log.topic }).asCallback((err: Error|null, categoriesRows?: Array<CategoriesRow>): void => {
              if (err) return callback(err);
              if (categoriesRows && categoriesRows.length) return callback(null);
              db.transacting(trx).insert({ category: log.topic, universe: onMarketContractData!.universe }).into("categories").asCallback(callback);
            });
          });
        });
      });
    });
  });
}

export function processMarketCreatedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  parallel([
    (next: AsyncCallback): void => {
      db.transacting(trx).from("markets").where({ marketID: log.market }).del().asCallback(next);
    },
    (next: AsyncCallback): void => {
      db.transacting(trx).from("outcomes").where({ marketID: log.market }).del().asCallback(next);
    },
    (next: AsyncCallback): void => {
      db.transacting(trx).from("tokens").where({ marketID: log.market }).del().asCallback(next);
    },
    (next: AsyncCallback): void => {
      db.transacting(trx).from("market_state").where({ marketID: log.market }).del().asCallback(next);
    },
  ], callback);
}
