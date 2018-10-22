import * as Knex from "knex";
import BigNumber from "bignumber.js";
import Augur from "augur.js";
import { forEachOf, series, parallel } from "async";
import { Address, FormattedEventLog, MarketCreatedLogExtraInfo, MarketsRow, OutcomesRow, TokensRow, CategoriesRow, ErrorCallback, AsyncCallback, GenericCallback } from "../../types";
import { convertDivisorToRate } from "../../utils/convert-divisor-to-rate";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { createSearchProvider } from "../../database/fts";
import { contentSearchBuilder } from "../../utils/content-search-builder";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { augurEmitter } from "../../events";
import { ETHER, MarketType, SubscriptionEventNames, WEI_PER_ETHER, ZERO } from "../../constants";
import { getCurrentTime } from "../process-block";

function getOutcomes(augur: Augur, log: FormattedEventLog, callback: GenericCallback<any>) {
  const marketPayload: {} = { tx: { to: log.market } };
  const numOutcomes = parseInt(log.marketType, 10) === MarketType.categorical ? log.outcomes.length : 2;

  const shareTokens = new Array(numOutcomes);
  const outcomeNames: Array<string|number|null> = (log.marketType === "1" && log.outcomes) ? log.outcomes : new Array(numOutcomes).fill(null);

  forEachOf(shareTokens, (_: null, outcome: number, nextOutcome: ErrorCallback): void => {
    augur.api.Market.getShareToken(Object.assign({ _outcome: outcome }, marketPayload), (err: Error|null, shareToken?: Address): void => {
      if (err) return nextOutcome(err);
      shareTokens[outcome] = shareToken;
      nextOutcome(null);
    });
  }, (err: Error|null): void => {
    if (err) return callback(err);
    callback(null, {
      numOutcomes,
      outcomeNames,
      shareTokens,
    });
  });
}

export function processMarketCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const marketPayload: {} = { tx: { to: log.market } };
  const universePayload: {} = { tx: { to: log.universe, send: false } };
  parallel({
    feeWindow: (next: AsyncCallback): void => { augur.api.Market.getFeeWindow(marketPayload, next); },
    endTime: (next: AsyncCallback): void => { augur.api.Market.getEndTime(marketPayload, next); },
    designatedReporter: (next: AsyncCallback): void => { augur.api.Market.getDesignatedReporter(marketPayload, next); },
    marketCreatorMailbox: (next: AsyncCallback): void => { augur.api.Market.getMarketCreatorMailbox(marketPayload, next); },
    numTicks: (next: AsyncCallback): void => { augur.api.Market.getNumTicks(marketPayload, next); },
    marketCreatorSettlementFeeDivisor: (next: AsyncCallback): void => { augur.api.Market.getMarketCreatorSettlementFeeDivisor(marketPayload, next); },
    reportingFeeDivisor: (next: AsyncCallback): void => { augur.api.Universe.getOrCacheReportingFeeDivisor(universePayload, next); },
    validityBondAttoeth: (next: AsyncCallback): void => { augur.api.Market.getValidityBondAttoeth(marketPayload, next); },
    getOutcomes: (next: AsyncCallback): void => getOutcomes(augur, log, next),
  }, (err: Error|null, onContractData?: any): void => {
    if (err) return callback(err);
    if (!onContractData) return callback(new Error(`Could not fetch market details for market: ${log.market}`));
    db("balances_detail").first("balance").where({ owner: log.market, symbol: "REP" }).asCallback((err?: any, designatedReportStakeRow?: { balance: BigNumber }): void => {
      if (err) return callback(err);
      if (designatedReportStakeRow == null) return callback(new Error(`No REP balance on market: ${log.market} (${log.transactionHash}`));
      const marketStateDataToInsert: { [index: string]: string|number|boolean } = {
        marketId: log.market,
        reportingState: augur.constants.REPORTING_STATE.PRE_REPORTING,
        blockNumber: log.blockNumber,
      };
      let query = db.insert(marketStateDataToInsert).into("market_state");
      if (db.client.config.client !== "sqlite3") {
        query = query.returning("marketStateId");
      }
      query.asCallback((err: Error|null, marketStateRow?: Array<number>): void => {
        if (err) return callback(err);
        if (!marketStateRow || !marketStateRow.length) return callback(new Error("No market state ID"));
        const marketStateId = marketStateRow[0];
        const extraInfo: MarketCreatedLogExtraInfo = (log.extraInfo != null && typeof log.extraInfo === "object") ? log.extraInfo : {};
        const marketType: string = MarketType[log.marketType];
        const marketsDataToInsert: MarketsRow<string|number> = {
          marketType,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
          marketId: log.market,
          marketCreator: log.marketCreator,
          creationBlockNumber: log.blockNumber,
          creationFee: log.marketCreationFee,
          category: log.topic,
          shortDescription: log.description,
          minPrice: log.minPrice,
          maxPrice: log.maxPrice,
          tag1: (extraInfo!.tags && extraInfo!.tags!.length) ? extraInfo!.tags![0] : null,
          tag2: (extraInfo!.tags && extraInfo!.tags!.length > 1) ? extraInfo!.tags![1] : null,
          longDescription: extraInfo!.longDescription || null,
          scalarDenomination: extraInfo!._scalarDenomination || null,
          resolutionSource: extraInfo!.resolutionSource || null,
          universe: log.universe,
          numOutcomes: onContractData.getOutcomes.numOutcomes,
          marketStateId,
          feeWindow: onContractData.feeWindow,
          endTime: parseInt(onContractData.endTime!, 10),
          designatedReporter: onContractData.designatedReporter,
          designatedReportStake: convertFixedPointToDecimal(designatedReportStakeRow.balance, WEI_PER_ETHER),
          numTicks: onContractData.numTicks,
          marketCreatorFeeRate: convertDivisorToRate(onContractData.marketCreatorSettlementFeeDivisor!, 10),
          marketCreatorMailbox: onContractData.marketCreatorMailbox,
          marketCreatorMailboxOwner: log.marketCreator,
          initialReportSize: null,
          reportingFeeRate: convertDivisorToRate(onContractData.reportingFeeDivisor!, 10),
          marketCreatorFeesBalance: "0",
          volume: "0",
          sharesOutstanding: "0",
          openInterest: "0",
          validityBondSize: onContractData.validityBondAttoeth,
          forking: 0,
          needsMigration: 0,
          needsDisavowal: 0,
          finalizationBlockNumber: null,
        };
        const outcomesDataToInsert: Partial<OutcomesRow<string>> = formatBigNumberAsFixed<Partial<OutcomesRow<BigNumber>>, Partial<OutcomesRow<string>>>({
          marketId: log.market,
          price: new BigNumber(log.minPrice, 10).plus(new BigNumber(log.maxPrice, 10)).dividedBy(new BigNumber(onContractData.getOutcomes.numOutcomes, 10)),
          volume: ZERO,
          shareVolume: ZERO,
        });
        const tokensDataToInsert: Partial<TokensRow> = {
          marketId: log.market,
          symbol: "shares",
        };

        series([
          (next: AsyncCallback): void => {
            db.insert(marketsDataToInsert).into("markets").asCallback(next);
          },
          (next: AsyncCallback): void => {
            const searchProvider = createSearchProvider(db);
            if (searchProvider !== null) {
              searchProvider.addSearchData(contentSearchBuilder(marketsDataToInsert)).then(next).catch(next);
            } else {
              next(null);
            }
          },
          (next: AsyncCallback): void => {
            db.batchInsert("outcomes", onContractData.getOutcomes.shareTokens.map((_: Address, outcome: number): Partial<OutcomesRow<string>> => Object.assign({
              outcome,
              description: onContractData.getOutcomes.outcomeNames[outcome],
            }, outcomesDataToInsert)), onContractData.getOutcomes.numOutcomes).asCallback(next);
          },
          (next: AsyncCallback): void => {
            db.batchInsert("tokens", onContractData.getOutcomes.shareTokens.map((contractAddress: Address, outcome: number): Partial<TokensRow> => Object.assign({
              contractAddress,
              outcome,
            }, tokensDataToInsert)), onContractData.getOutcomes.numOutcomes).asCallback(next);
          },
          (next: AsyncCallback): void => {
            db.batchInsert("token_supply", onContractData.getOutcomes.shareTokens.map((contractAddress: Address, outcome: number): Partial<TokensRow> => Object.assign({
              token: contractAddress,
              supply: "0",
            })), onContractData.getOutcomes.numOutcomes).asCallback(next);
          },
          (next: AsyncCallback): void => {
            db.insert({
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash,
              logIndex: log.logIndex,
              token: ETHER,
              sender: log.marketCreator,
              recipient: log.market,
              value: onContractData.validityBondAttoeth,
            }).into("transfers").asCallback(next);
          },
        ], (err: Error|null): void => {
          if (err) return callback(err);
          augurEmitter.emit(SubscriptionEventNames.MarketCreated, Object.assign(
            { creationTime: getCurrentTime() },
            log,
            marketsDataToInsert));
          db.select("popularity").from("categories").where({ category: log.topic.toUpperCase(), universe: log.universe }).asCallback((err: Error|null, categoriesRows?: Array<CategoriesRow>): void => {
            if (err) return callback(err);
            if (categoriesRows && categoriesRows.length) return callback(null);
            db.insert({ category: log.topic.toUpperCase(), universe: log.universe }).into("categories").asCallback(callback);
          });
        });
      });
    });
  });
}

async function marketCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog): Promise<void> {
  const marketId = log.market;
  await db.from("markets").where({ marketId }).del();
  await db.from("outcomes").where({ marketId }).del();
  await db.from("token_supply").whereIn("token", (queryBuilder) => {
    return queryBuilder.select("contractAddress").from("tokens").where({ marketId });
  }).del();
  await db.from("tokens").where({ marketId }).del();
  await db.from("market_state").where({ marketId }).del();
  await db.from("transfers").where({ recipient: marketId, token: ETHER }).del();

  const searchProvider = createSearchProvider(db);
  if (searchProvider !== null) {
    await searchProvider.removeSeachData(log.market);
  }
  augurEmitter.emit(SubscriptionEventNames.MarketCreated, log);
}

export function processMarketCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  marketCreatedLogRemoval(db, augur, log).then(() => callback(null), callback);
}
