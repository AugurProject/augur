import * as Knex from "knex";
import BigNumber from "bignumber.js";
import Augur from "augur.js";
import * as _ from "lodash";
import { each } from "bluebird";
import { forEachOf} from "async";
import { Address, FormattedEventLog, MarketCreatedLogExtraInfo, MarketsRow, OutcomesRow, TokensRow, CategoriesRow, ErrorCallback} from "../../types";
import { convertDivisorToRate } from "../../utils/convert-divisor-to-rate";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { createSearchProvider } from "../../database/fts";
import { contentSearchBuilder } from "../../utils/content-search-builder";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { augurEmitter } from "../../events";
import { ETHER, MarketType, SubscriptionEventNames, WEI_PER_ETHER, ZERO } from "../../constants";
import { getCurrentTime } from "../process-block";

function getOutcomes(augur: Augur, log: FormattedEventLog) {
  return new Promise((resolve, reject) => {

    const marketPayload: {} = { tx: { to: log.market } };
    const numOutcomes = parseInt(log.marketType, 10) === MarketType.categorical ? log.outcomes.length : 2;

    const shareTokens = new Array(numOutcomes);
    const outcomeNames: Array<string|number|null> = (log.marketType === "1" && log.outcomes) ? log.outcomes : new Array(numOutcomes).fill(null);

    forEachOf(shareTokens, async (_: null, outcome: number, nextOutcome: ErrorCallback) => {
      const shareToken = await augur.api.Market.getShareToken(Object.assign({ _outcome: outcome }, marketPayload)).catch(nextOutcome);
      shareTokens[outcome] = shareToken;
      nextOutcome(null);
    }, (err: Error|null): void => {
      if (err) return reject(err);
      resolve({
        numOutcomes,
        outcomeNames,
        shareTokens,
      });
    });
  });
}

export async function processMarketCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog) {
  const marketPayload: {} = { tx: { to: log.market } };
  const universePayload: {} = { tx: { to: log.universe, send: false } };

  const callPromises = {
    feeWindow: augur.api.Market.getFeeWindow(marketPayload),
    endTime: augur.api.Market.getEndTime(marketPayload),
    designatedReporter: augur.api.Market.getDesignatedReporter(marketPayload),
    marketCreatorMailbox: augur.api.Market.getMarketCreatorMailbox(marketPayload),
    numTicks: augur.api.Market.getNumTicks(marketPayload),
    marketCreatorSettlementFeeDivisor: augur.api.Market.getMarketCreatorSettlementFeeDivisor(marketPayload),
    reportingFeeDivisor: augur.api.Universe.getOrCacheReportingFeeDivisor(universePayload),
    validityBondAttoeth: augur.api.Market.getValidityBondAttoeth(marketPayload),
    getOutcomes: getOutcomes(augur, log),
  };
  const calls = _.zipObject(_.keys(callPromises), await Promise.all(_.values(callPromises)));

  const designatedReportStakeRow: { balance: BigNumber } = await db("balances_detail").first("balance").where({ owner: log.market, symbol: "REP" });
  if (designatedReportStakeRow == null) throw new Error(`No REP balance on market: ${log.market} (${log.transactionHash}`);
  const marketStateDataToInsert: { [index: string]: string|number|boolean } = {
    marketId: log.market,
    reportingState: augur.constants.REPORTING_STATE.PRE_REPORTING,
    blockNumber: log.blockNumber,
  };
  let query = db.insert(marketStateDataToInsert).into("market_state");
  if (db.client.config.client !== "sqlite3") {
    query = query.returning("marketStateId");
  }
  const marketStateRow: Array<number> = await query;
  if (!marketStateRow || !marketStateRow.length) throw new Error("No market state ID");
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
    numOutcomes: calls.getOutcomes.numOutcomes,
    marketStateId,
    feeWindow: calls.feeWindow,
    endTime: parseInt(calls.endTime, 10),
    designatedReporter: calls.designatedReporter,
    designatedReportStake: convertFixedPointToDecimal(designatedReportStakeRow.balance, WEI_PER_ETHER),
    numTicks: calls.numTicks,
    marketCreatorFeeRate: convertDivisorToRate(calls.marketCreatorSettlementFeeDivisor, 10),
    marketCreatorMailbox: calls.marketCreatorMailbox,
    marketCreatorMailboxOwner: log.marketCreator,
    initialReportSize: null,
    reportingFeeRate: convertDivisorToRate(calls.reportingFeeDivisor, 10),
    marketCreatorFeesBalance: "0",
    volume: "0",
    sharesOutstanding: "0",
    openInterest: "0",
    validityBondSize: calls.validityBondAttoeth,
    forking: 0,
    needsMigration: 0,
    needsDisavowal: 0,
    finalizationBlockNumber: null,
  };
  const outcomesDataToInsert: Partial<OutcomesRow<string>> = formatBigNumberAsFixed<Partial<OutcomesRow<BigNumber>>, Partial<OutcomesRow<string>>>({
    marketId: log.market,
    price: new BigNumber(log.minPrice, 10).plus(new BigNumber(log.maxPrice, 10)).dividedBy(new BigNumber(calls.getOutcomes.numOutcomes, 10)),
    volume: ZERO,
    shareVolume: ZERO,
  });
  const tokensDataToInsert: Partial<TokensRow> = {
    marketId: log.market,
    symbol: "shares",
  };
  await db.insert(marketsDataToInsert).into("markets");
  const searchProvider = createSearchProvider(db);
  if (searchProvider !== null) {
    await searchProvider.addSearchData(contentSearchBuilder(marketsDataToInsert));
  }
  await db.batchInsert("outcomes", calls.getOutcomes.shareTokens.map((_: Address, outcome: number): Partial<OutcomesRow<string>> => Object.assign({
    outcome,
    description: calls.getOutcomes.outcomeNames[outcome],
  }, outcomesDataToInsert)), calls.getOutcomes.numOutcomes);
  await db.batchInsert("tokens", calls.getOutcomes.shareTokens.map((contractAddress: Address, outcome: number): Partial<TokensRow> => Object.assign({
    contractAddress,
    outcome,
  }, tokensDataToInsert)), calls.getOutcomes.numOutcomes);
  await db.batchInsert("token_supply", calls.getOutcomes.shareTokens.map((contractAddress: Address, outcome: number): Partial<TokensRow> => Object.assign({
    token: contractAddress,
    supply: "0",
  })), calls.getOutcomes.numOutcomes);

  await db.insert({
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    token: ETHER,
    sender: log.marketCreator,
    recipient: log.market,
    value: calls.validityBondAttoeth,
  }).into("transfers");
  augurEmitter.emit(SubscriptionEventNames.MarketCreated, Object.assign(
    { creationTime: getCurrentTime() },
    log,
    marketsDataToInsert));
  await db.select("popularity").from("categories").where({ category: log.topic.toUpperCase(), universe: log.universe })
    .then((categoriesRows: Array<CategoriesRow>) => {
      if (categoriesRows && categoriesRows.length) return;
      return db.insert({ category: log.topic.toUpperCase(), universe: log.universe }).into("categories");
    });
}

export async function processMarketCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog): Promise<void> {
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
