import Knex from "knex";
import {
  Address,
  Augur,
  BigNumber,
  ErrorCallback,
  FormattedEventLog,
  MarketCreatedLogExtraInfo,
  MarketsRow,
  OutcomesRow,
  ReportingState,
  TokensRow
} from "../../types";
import { each } from "bluebird";
import { forEachOf } from "async";
import { convertDivisorToRate } from "../../utils/convert-divisor-to-rate";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { createSearchProvider } from "../../database/fts";
import { contentSearchBuilder } from "../../utils/content-search-builder";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { augurEmitter } from "../../events";
import { ETHER, MarketType, SubscriptionEventNames, WEI_PER_ETHER, ZERO } from "../../constants";
import { getCurrentTime } from "../process-block";

interface IOutcomes {
  numOutcomes: number;
  outcomeNames: Array<string|number|null>;
  shareTokens: Array<string>;
}


function getOutcomes(augur: Augur, log: FormattedEventLog) {
  return new Promise<IOutcomes>((resolve, reject) => {
    const market = augur.getMarket(log.market);
    const numOutcomes = parseInt(log.marketType, 10) === MarketType.categorical ? (log.outcomes.length + 1) : 3;

    const shareTokens = new Array(numOutcomes);
    const outcomeNames: Array<string|number|null> = (log.marketType === "1" && log.outcomes) ? log.outcomes : new Array(numOutcomes - 1).fill(null);

    forEachOf(shareTokens, async (_: null, outcome: number, nextOutcome: ErrorCallback) => {
      const shareToken = await market.getShareToken_(new BigNumber(outcome));
      shareTokens[outcome] = shareToken;
      nextOutcome(null);
    }, (err: Error | null): void => {
      if (err) return reject(err);
      resolve({
        numOutcomes,
        outcomeNames,
        shareTokens,
      });
    });
  });
}

export async function processMarketCreatedLog(augur: Augur, log: FormattedEventLog) {
  const market = augur.getMarket(log.market);
  const calls = {
    disputeWindow: (await market.getDisputeWindow_()).toString(),
    endTime: (await market.getEndTime_()).toString(),
    designatedReporter: (await market.getDesignatedReporter_()).toString(),
    numTicks: (await market.getNumTicks_()).toString(),
    marketCreatorSettlementFeeDivisor: (await market.getMarketCreatorSettlementFeeDivisor_()).toString(),
    reportingFeeDivisor: (await augur.contracts.universe.getOrCacheReportingFeeDivisor_()).toString(),
    validityBondAttoeth: (await market.getValidityBondAttoEth_()).toString(),
    getOutcomes: await getOutcomes(augur, log),
  };

  return async (db: Knex) => {
    const designatedReportStakeRow: { balance: BigNumber } = await db("balances_detail").first("balance").where({ owner: log.market, symbol: "REP" });
    if (designatedReportStakeRow == null) throw new Error(`No REP balance on market: ${log.market} (${log.transactionHash}`);
    const marketStateDataToInsert: { [index: string]: string | number | boolean } = {
      marketId: log.market,
      reportingState: ReportingState.PRE_REPORTING,
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
    const marketCategoryName = canonicalizeCategoryName(log.topic);
    const marketsDataToInsert: MarketsRow<string | number> = {
      marketType,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      marketId: log.market,
      marketCreator: log.marketCreator,
      creationBlockNumber: log.blockNumber,
      creationFee: log.marketCreationFee,
      category: marketCategoryName,
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
      disputeWindow: calls.disputeWindow,
      endTime: parseInt(calls.endTime, 10),
      designatedReporter: calls.designatedReporter,
      designatedReportStake: convertFixedPointToDecimal(designatedReportStakeRow.balance, WEI_PER_ETHER),
      numTicks: calls.numTicks,
      marketCreatorFeeRate: convertDivisorToRate(calls.marketCreatorSettlementFeeDivisor),
      initialReportSize: null,
      reportingFeeRate: convertDivisorToRate(calls.reportingFeeDivisor),
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
      price: new BigNumber(log.minPrice).add(new BigNumber(log.maxPrice)).div(new BigNumber(calls.getOutcomes.numOutcomes)),
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
      description: outcome === 0 ? "Invalid" : calls.getOutcomes.outcomeNames[outcome - 1],
    }, outcomesDataToInsert)), calls.getOutcomes.numOutcomes);
    await db.batchInsert("tokens", calls.getOutcomes.shareTokens.map((contractAddress: Address, outcome: number): Partial<TokensRow> => Object.assign({
      contractAddress,
      outcome,
    }, tokensDataToInsert)), calls.getOutcomes.numOutcomes);
    await db.batchInsert("token_supply", calls.getOutcomes.shareTokens.map((contractAddress: Address): Partial<TokensRow> => Object.assign({
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

    await createCategoryIfNotExists(db, log.universe, marketCategoryName);
  };
}

// canonicalizeCategoryName owns the definition of what it means to
// sanitize/canonicalize a category name. augur-node needn't make
// assumptions about user-provided category names stored on the
// blockchain. Instead, we process each category name once, here, and
// then augur-node can use category names anonymously everywhere, ie.
// everywhere else can assume the category names are already okay/sanitized.
function canonicalizeCategoryName(categoryName: string): string {
  // Right now we uppercase every category name, such that
  // "Sports" and "sports" are the same category within
  // augur-node and, downstream, from the end user perspective.
  return categoryName.toUpperCase();
}

export async function createCategoryIfNotExists(db: Knex, universe: string, categoryName: string) {
  // select openInterest as a cheap column to then count results. Might be replaced with Knex.count()
  const categoriesRows = await db.select("openInterest").from("categories").where({ category: categoryName, universe });
  if (categoriesRows && categoriesRows.length) return; // category already exists
  return db.insert({ category: categoryName, universe }).into("categories");
}

export async function processMarketCreatedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
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
  };
}
