import { forEachOf, series, parallel } from "async";
import Augur from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, FormattedEventLog, MarketCreatedLogExtraInfo, MarketsRow, SearchRow, OutcomesRow, TokensRow, CategoriesRow, ErrorCallback, AsyncCallback } from "../../types";
import { convertDivisorToRate } from "../../utils/convert-divisor-to-rate";
import { contentSearchBuilder} from "../../utils/content-search-builder";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { augurEmitter } from "../../events";
import { MarketType, WEI_PER_ETHER, ZERO } from "../../constants";
import { getCurrentTime } from "../process-block";

export function processMarketCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const marketPayload: {} = { tx: { to: log.market } };
  const universePayload: {} = { tx: { to: log.universe, send: false } };
  parallel({
    feeWindow: (next: AsyncCallback): void => augur.api.Market.getFeeWindow(marketPayload, next),
    endTime: (next: AsyncCallback): void => augur.api.Market.getEndTime(marketPayload, next),
    designatedReporter: (next: AsyncCallback): void => augur.api.Market.getDesignatedReporter(marketPayload, next),
    marketCreatorMailbox: (next: AsyncCallback): void => augur.api.Market.getMarketCreatorMailbox(marketPayload, next),
    numTicks: (next: AsyncCallback): void => augur.api.Market.getNumTicks(marketPayload, next),
    marketCreatorSettlementFeeDivisor: (next: AsyncCallback): void => augur.api.Market.getMarketCreatorSettlementFeeDivisor(marketPayload, next),
    reportingFeeDivisor: (next: AsyncCallback): void => augur.api.Universe.getOrCacheReportingFeeDivisor(universePayload, next),
  }, (err: Error|null, onContractData?: any): void => {
    if (err) return callback(err);
    if (!onContractData) return callback(new Error(`Could not fetch market details for market: ${log.market}`));
    db("balances_detail").first("balance").where({owner: log.market, symbol: "REP"}).asCallback((err?: any, designatedReportStakeRow?: {balance: BigNumber}): void => {
      if (err) return callback(err);
      if (designatedReportStakeRow == null) return callback(new Error(`No REP balance on market: ${log.market} (${log.transactionHash}`));
      const marketStateDataToInsert: { [index: string]: string|number|boolean } = {
        marketId: log.market,
        reportingState: augur.constants.REPORTING_STATE.PRE_REPORTING,
        blockNumber: log.blockNumber,
      };
      db.insert(marketStateDataToInsert).into("market_state").asCallback((err: Error|null, marketStateRow?: Array<number>): void => {
        if (err) return callback(err);
        if (!marketStateRow || !marketStateRow.length) return callback(new Error("No market state ID"));
        const marketStateId = marketStateRow[0];
        const extraInfo: MarketCreatedLogExtraInfo = (log.extraInfo != null && typeof log.extraInfo === "object") ? log.extraInfo : {};
        const numOutcomes = parseInt(log.marketType, 10) === MarketType.categorical ? log.outcomes.length : 2;
        const marketType: string = MarketType[log.marketType];
        const marketsDataToInsert: MarketsRow<string|number> = {
          marketType,
          marketId:                   log.market,
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
          scalarDenomination:         extraInfo!._scalarDenomination || null,
          resolutionSource:           extraInfo!.resolutionSource || null,
          universe:                   log.universe,
          numOutcomes,
          marketStateId,
          feeWindow:                  onContractData.feeWindow,
          endTime:                    parseInt(onContractData.endTime!, 10),
          designatedReporter:         onContractData.designatedReporter,
          designatedReportStake:      convertFixedPointToDecimal(designatedReportStakeRow.balance, WEI_PER_ETHER),
          numTicks:                   onContractData.numTicks,
          marketCreatorFeeRate:       convertDivisorToRate(onContractData.marketCreatorSettlementFeeDivisor!, 10),
          marketCreatorMailbox:       onContractData.marketCreatorMailbox,
          marketCreatorMailboxOwner:  log.marketCreator,
          initialReportSize:          null,
          reportingFeeRate:           convertDivisorToRate(onContractData.reportingFeeDivisor!, 10),
          marketCreatorFeesBalance:   "0",
          volume:                     "0",
          sharesOutstanding:          "0",
          forking:                    0,
          needsMigration:             0,
          needsDisavowal:             0,
          finalizationBlockNumber:    null,
        };
        const outcomesDataToInsert: Partial<OutcomesRow<string>> = formatBigNumberAsFixed<Partial<OutcomesRow<BigNumber>>, Partial<OutcomesRow<string>>>({
          marketId: log.market,
          price: new BigNumber(log.minPrice, 10).plus(new BigNumber(log.maxPrice, 10)).dividedBy(new BigNumber(numOutcomes, 10)),
          volume: ZERO,
        });
        const fullTextStringInsert: SearchRow = {
          marketId: marketsDataToInsert.marketId,
          content: contentSearchBuilder(marketsDataToInsert),
        };
        const tokensDataToInsert: Partial<TokensRow> = {
          marketId: log.market,
          symbol: "shares",
        };
        const shareTokens = new Array(numOutcomes);
        forEachOf(shareTokens, (_: null, outcome: number, nextOutcome: ErrorCallback): void => {
          augur.api.Market.getShareToken(Object.assign({ _outcome: outcome }, marketPayload), (err: Error|null, shareToken?: Address): void => {
            if (err) return nextOutcome(err);
            shareTokens[outcome] = shareToken;
            nextOutcome(null);
          });
        }, (err: Error|null): void => {
          if (err) return callback(err);
          const outcomeNames: Array<string|number|null> = (log.marketType === "1" && log!.outcomes) ? log!.outcomes! : new Array(numOutcomes).fill(null);
          series([
            (next: AsyncCallback): void => {
              db.insert(marketsDataToInsert).into("markets").asCallback(next);
            },
            (next: AsyncCallback): void => {
              db.raw("insert into search_en(marketId, content) values( ?, ? )", [fullTextStringInsert.marketId, fullTextStringInsert.content]).asCallback(next);
            },
            (next: AsyncCallback): void => {
              db.batchInsert("outcomes", shareTokens.map((_: Address, outcome: number): Partial<OutcomesRow<string>> => Object.assign({ outcome, description: outcomeNames[outcome] }, outcomesDataToInsert)), numOutcomes).asCallback(next);
            },
            (next: AsyncCallback): void => {
              db.batchInsert("tokens", shareTokens.map((contractAddress: Address, outcome: number): Partial<TokensRow> => Object.assign({ contractAddress, outcome }, tokensDataToInsert)), numOutcomes).asCallback(next);
            },
            (next: AsyncCallback): void => {
              db.batchInsert("token_supply", shareTokens.map((contractAddress: Address, outcome: number): Partial<TokensRow> => Object.assign({ token: contractAddress, supply: "0" })), numOutcomes).asCallback(next);
            },
          ], (err: Error|null): void => {
            if (err) return callback(err);
            augurEmitter.emit("MarketCreated", Object.assign(
              { creationTime: getCurrentTime() },
              log,
              marketsDataToInsert));
            db.select("popularity").from("categories").where({ category: log.topic, universe: log.universe }).asCallback((err: Error|null, categoriesRows?: Array<CategoriesRow>): void => {
              if (err) return callback(err);
              if (categoriesRows && categoriesRows.length) return callback(null);
              db.insert({ category: log.topic, universe: log.universe }).into("categories").asCallback(callback);
            });
          });
        });
      });
    });
  });
}

export function processMarketCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  series([
    (next: AsyncCallback): void => {
      db.from("markets").where({ marketId: log.market }).del().asCallback(next);
    },
    (next: AsyncCallback): void => {
      db.from("outcomes").where({ marketId: log.market }).del().asCallback(next);
    },
    (next: AsyncCallback): void => {
      db.from("tokens").where({ marketId: log.market }).del().asCallback(next);
    },
    (next: AsyncCallback): void => {
      db.from("market_state").where({ marketId: log.market }).del().asCallback(next);
    },
    (next: AsyncCallback): void => {
      db.from("search_en").where({ marketId: log.market }).del().asCallback(next);
    },
  ], (err) => {
    if (err) callback(err);
    augurEmitter.emit("MarketCreated", log);
    callback(null);
  });
}
