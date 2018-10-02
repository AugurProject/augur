import * as Knex from "knex";
import Augur from "augur.js";
import { JsonRpcRequest } from "../types";
import { getAccountTransferHistory } from "./getters/get-account-transfer-history";
import { extractGetCategoriesParams, getCategories } from "./getters/get-categories";
import { getMarketsInCategory } from "./getters/get-markets-in-category";
import { getMarketsCreatedByUser } from "./getters/get-markets-created-by-user";
import { getReportingHistory } from "./getters/get-reporting-history";
import { extractGetReportingSummaryParams, getReportingSummary } from "./getters/get-reporting-summary";
import { getTradingHistory } from "./getters/get-trading-history";
import { extractGetMarketPriceHistoryParams, getMarketPriceHistory } from "./getters/get-market-price-history";
import { getMarketPriceCandlesticks } from "./getters/get-market-price-candlesticks";
import { getUserTradingPositions } from "./getters/get-user-trading-positions";
import { getUserShareBalances } from "./getters/get-user-share-balances";
import { getFeeWindows } from "./getters/get-fee-windows";
import { getFeeWindow } from "./getters/get-fee-window";
import { getUnclaimedMarketCreatorFees } from "./getters/get-unclaimed-market-creator-fees";
import { getDisputeTokens } from "./getters/get-dispute-tokens";
import { getMarkets } from "./getters/get-markets";
import { extractGetMarketsClosingInDateRangeParams, getMarketsClosingInDateRange } from "./getters/get-markets-closing-in-date-range";
import { extractGetMarketsInfoParams, getMarketsInfo } from "./getters/get-markets-info";
import { getOrders } from "./getters/get-orders";
import { getAllOrders } from "./getters/get-all-orders";
import { getCompleteSets } from "./getters/get-complete-sets";
import { getBetterWorseOrders } from "./getters/get-better-worse-orders";
import { extractNoParams, getSyncData } from "./getters/get-sync-data";
import { extractGetDisputeInfoParams, getDisputeInfo } from "./getters/get-dispute-info";
import { getInitialReporters } from "./getters/get-initial-reporters";
import { getForkMigrationTotals } from "./getters/get-fork-migration-totals";
import { getReportingFees } from "./getters/get-reporting-fees";
import { getUniversesInfo } from "./getters/get-universes-info";
import { getProfitLoss } from "./getters/get-profit-loss";
import { getWinningBalance } from "./getters/get-winning-balance";
import { logger } from "../utils/logger";

type GetterFunction<T, R> = (db: Knex, augur: Augur, params: T) => Promise<R>;
type ParamExtract<T> = (params: any) => T|undefined;

export function dispatchJsonRpcRequest(db: Knex, request: JsonRpcRequest, augur: Augur, callback: (err?: Error|null, result?: any) => void): void {
  logger.info(JSON.stringify(request));

  function dispatchResponse<T, R>(getterFunction: GetterFunction<T, R>, paramExtract: ParamExtract<T>) {
    const extractedParams = paramExtract(request.params);
    if (extractedParams === undefined) return callback(new Error("Invalid parameters"));
    getterFunction(db, augur, extractedParams).then((response) => {
      callback(null, response);
    }).catch(callback);
    return;
  }

  switch (request.method) {
    case "getDisputeInfo":
      return dispatchResponse(getDisputeInfo, extractGetDisputeInfoParams);
    case "getReportingSummary":
      return dispatchResponse(getReportingSummary, extractGetReportingSummaryParams);
    case "getMarketPriceHistory":
      return dispatchResponse(getMarketPriceHistory, extractGetMarketPriceHistoryParams);
    case "getCategories":
      return dispatchResponse(getCategories, extractGetCategoriesParams);
    case "getContractAddresses":
    case "getSyncData":
      return dispatchResponse(getSyncData, extractNoParams);
    case "getMarketsInfo":
      return dispatchResponse(getMarketsInfo, extractGetMarketsInfoParams);
    case "getMarketsClosingInDateRange":
      return dispatchResponse(getMarketsClosingInDateRange, extractGetMarketsClosingInDateRangeParams);

    case "getAccountTransferHistory":
      return getAccountTransferHistory(db, request.params.account, request.params.token, request.params.isInternalTransfer, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getReportingHistory":
      return getReportingHistory(db, request.params.reporter, request.params.universe, request.params.marketId, request.params.reportingWindow, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getTradingHistory":
      return getTradingHistory(db, request.params.universe, request.params.account, request.params.marketId, request.params.outcome, request.params.orderType, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, request.params.ignoreSelfTrades, callback);
    case "getUserTradingHistory":
      // TODO: remove reference to getUserTradingHistory from UI and delete this (ch12974)
      return getTradingHistory(db, request.params.universe, request.params.account, request.params.marketId, request.params.outcome, request.params.orderType, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, request.params.ignoreSelfTrades, callback);
    case "getMarketPriceCandlesticks":
      return getMarketPriceCandlesticks(db, request.params.marketId, request.params.outcome, request.params.start, request.params.end, request.params.period, callback);
    case "getUserTradingPositions":
      return getUserTradingPositions(db, augur, request.params.universe, request.params.account, request.params.marketId, request.params.outcome, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getFeeWindowCurrent":
      return getFeeWindow(db, augur, request.params.universe, request.params.reporter, "current", null, callback);
    case "getFeeWindow":
      return getFeeWindow(db, augur, request.params.universe, request.params.reporter, request.params.feeWindowState, request.params.feeWindow, callback);
    case "getFeeWindows":
      return getFeeWindows(db, augur, request.params.universe, request.params.account, request.params.includeCurrent, callback);
    case "getUnclaimedMarketCreatorFees":
      return getUnclaimedMarketCreatorFees(db, augur, request.params.marketIds, callback);
    case "getWinningBalance":
      return getWinningBalance(db, augur, request.params.marketIds, request.params.account, callback);
    case "getDisputeTokens":
      return getDisputeTokens(db, request.params.universe, request.params.account, request.params.stakeTokenState, callback);
    case "getInitialReporters":
      return getInitialReporters(db, augur, request.params.universe, request.params.reporter, request.params.redeemed, request.params.withRepBalance, callback);
    case "getReportingFees":
      return getReportingFees(db, augur, request.params.reporter, request.params.universe, callback);
    case "getForkMigrationTotals":
      return getForkMigrationTotals(db, augur, request.params.parentUniverse, callback);
    case "getMarkets":
      return getMarkets(db, request.params.universe, request.params.creator, request.params.category, request.params.search, request.params.reportingState, request.params.feeWindow, request.params.designatedReporter, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getOrders":
      return getOrders(db, request.params.universe, request.params.marketId, request.params.outcome, request.params.orderType, request.params.creator, request.params.orderState, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, request.params.orphaned, callback);
    case "getAllOrders":
      return getAllOrders(db, request.params.account, callback);
    case "getBetterWorseOrders":
      return getBetterWorseOrders(db, request.params.marketId, request.params.outcome, request.params.orderType, request.params.price, callback);
    case "getCompleteSets":
      return getCompleteSets(db, request.params.universe, request.params.account, callback);
    case "getUniversesInfo":
      return getUniversesInfo(db, augur, request.params.universe, request.params.account, callback);
    case "getProfitLoss":
      return getProfitLoss(db, augur, request.params.universe, request.params.account, request.params.startTime, request.params.endTime, request.params.periodInterval, callback);
    case "getUserShareBalances":
      return getUserShareBalances(db, augur, request.params.marketIds, request.params.account, callback);

      // DELETE?
    case "getMarketsInCategory":
      return getMarketsInCategory(db, request.params.universe, request.params.category, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketsCreatedByUser":
      return getMarketsCreatedByUser(db, request.params.universe, request.params.creator, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    default:
      callback(new Error("unknown json rpc method"));
  }
}
