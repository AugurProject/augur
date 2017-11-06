import { forEachOf, parallel } from "async";
import Augur from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, Int256, FormattedLog, MarketCreatedLogExtraInfo, MarketCreatedOnContractInfo, MarketsRow, ErrorCallback, AsyncCallback } from "../../types";
import { convertDivisorToRate } from "../../utils/convert-divisor-to-rate";
import { augurEmitter } from "../../events";

interface OutcomesRow {
  marketID: Address;
  outcome?: number;
  price: string|number;
  sharesOutstanding: string|number;
}

interface TokensRow {
  contractAddress?: Address;
  symbol: string;
  marketID: Address;
  outcome?: number;
}

interface CategoriesRow {
  popularity: string|number;
}

export function processMarketCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  const marketPayload: {} = { tx: { to: log.market } };
  parallel({
    numberOfOutcomes: (next: AsyncCallback): void => augur.api.Market.getNumberOfOutcomes(marketPayload, next),
    reportingWindow: (next: AsyncCallback): void => augur.api.Market.getReportingWindow(marketPayload, next),
    endTime: (next: AsyncCallback): void => augur.api.Market.getEndTime(marketPayload, next),
    designatedReporter: (next: AsyncCallback): void => augur.api.Market.getDesignatedReporter(marketPayload, next),
    designatedReportStake: (next: AsyncCallback): void => augur.api.Market.getDesignatedReportStake(marketPayload, next),
    numTicks: (next: AsyncCallback): void => augur.api.Market.getNumTicks(marketPayload, next),
    universe: (next: AsyncCallback): void => augur.api.Market.getUniverse(marketPayload, next),
    marketCreatorSettlementFeeDivisor: (next: AsyncCallback): void => augur.api.Market.getMarketCreatorSettlementFeeDivisor(marketPayload, next),
  }, (err?: any, onContractData?: any): void => {
    if (err) return callback(err);
    const universePayload: {} = { tx: { to: onContractData.universe } };
    augur.api.Universe.getReportingFeeDivisor(universePayload, (err: Error|null, reportingFeeDivisor?: string): void => {
      const marketStateDataToInsert: { [index: string]: string|number|boolean } = {
        marketID: log.market,
        reportingState: augur.constants.REPORTING_STATE.PRE_REPORTING,
        blockNumber: log.blockNumber,
      };
      db.transacting(trx).insert(marketStateDataToInsert).returning("marketStateID").into("market_state").asCallback((err: Error|null, marketStateRow?: Array<number>): void => {
        if (err) return callback(err);
        if (!marketStateRow || !marketStateRow.length) return callback(new Error("No market state ID"));
        const marketStateID = marketStateRow[0];
        const extraInfo: MarketCreatedLogExtraInfo = log.extraInfo;
        const numOutcomes = parseInt(onContractData!.numberOfOutcomes!, 16);
        const marketsDataToInsert: MarketsRow = {
          marketID:                   log.market,
          marketCreator:              log.marketCreator,
          creationBlockNumber:        log.blockNumber,
          creationFee:                log.marketCreationFee,
          marketType:                 extraInfo!.marketType,
          minPrice:                   extraInfo!.minPrice,
          maxPrice:                   extraInfo!.maxPrice,
          category:                   extraInfo!.category,
          tag1:                       extraInfo!.tag1 || null,
          tag2:                       extraInfo!.tag2 || null,
          shortDescription:           extraInfo!.shortDescription,
          longDescription:            extraInfo!.longDescription || null,
          resolutionSource:           extraInfo!.resolutionSource || null,
          universe:                   onContractData!.universe,
          numOutcomes,
          marketStateID,
          reportingWindow:            onContractData!.reportingWindow,
          endTime:                    parseInt(onContractData!.endTime!, 16),
          designatedReporter:         onContractData!.designatedReporter,
          designatedReportStake:      new BigNumber(onContractData!.designatedReportStake, 16).toFixed(),
          numTicks:                   parseInt(onContractData!.numTicks!, 16),
          marketCreatorFeeRate:       convertDivisorToRate(onContractData!.marketCreatorSettlementFeeDivisor!, 16),
          reportingFeeRate:           convertDivisorToRate(reportingFeeDivisor!, 16),
          marketCreatorFeesCollected: "0",
          volume:                     "0",
          sharesOutstanding:          "0",
        };
        const outcomesDataToInsert: OutcomesRow = {
          marketID: log.market,
          price: new BigNumber(1, 10).dividedBy(new BigNumber(numOutcomes, 10)).toFixed(),
          sharesOutstanding: "0",
        };
        const tokensDataToInsert: TokensRow = {
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
          parallel([
            (next: AsyncCallback): void => {
              db.transacting(trx).insert(marketsDataToInsert).into("markets").asCallback(next);
            },
            (next: AsyncCallback): void => {
              db.batchInsert("outcomes", shareTokens.map((_: Address, outcome: number): OutcomesRow => Object.assign({ outcome }, outcomesDataToInsert)), numOutcomes).transacting(trx).asCallback(next);
            },
            (next: AsyncCallback): void => {
              db.batchInsert("tokens", shareTokens.map((contractAddress: Address, outcome: number): TokensRow => Object.assign({ contractAddress, outcome }, tokensDataToInsert)), numOutcomes).transacting(trx).asCallback(next);
            },
          ], (err: Error|null): void => {
            trx.select("popularity").from("categories").where({ category: extraInfo!.category }).asCallback((err: Error|null, categoriesRows?: Array<CategoriesRow>): void => {
              if (err) return callback(err);
              if (categoriesRows && categoriesRows.length) return callback(null);
              db.transacting(trx).insert({ category: extraInfo!.category, universe: onContractData!.universe }).into("categories").asCallback(callback);
            });
          });
        });
      });
    });
  });
}

export function processMarketCreatedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
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
