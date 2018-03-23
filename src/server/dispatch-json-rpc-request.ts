import * as Knex from "knex";
import Augur from "augur.js";
import { JsonRpcRequest } from "../types";
import { getAccountTransferHistory } from "./getters/get-account-transfer-history";
import { getCategories } from "./getters/get-categories";
import { getMarketsInCategory } from "./getters/get-markets-in-category";
import { getMarketsCreatedByUser } from "./getters/get-markets-created-by-user";
import { getReportingHistory } from "./getters/get-reporting-history";
import { getReportingSummary } from "./getters/get-reporting-summary";
import { getUserTradingHistory } from "./getters/get-user-trading-history";
import { getMarketPriceHistory } from "./getters/get-market-price-history";
import { getUserTradingPositions } from "./getters/get-user-trading-positions";
import { getFeeWindows } from "./getters/get-fee-windows";
import { getFeeWindowCurrent } from "./getters/get-fee-window-current";
import { getUnclaimedMarketCreatorFees } from "./getters/get-unclaimed-market-creator-fees";
import { getDisputeTokens } from "./getters/get-dispute-tokens";
import { getMarkets } from "./getters/get-markets";
import { getMarketsClosingInDateRange } from "./getters/get-markets-closing-in-date-range";
import { getMarketsInfo } from "./getters/get-markets-info";
import { getOrders } from "./getters/get-orders";
import { getBetterWorseOrders } from "./getters/get-better-worse-orders";
import { getContractAddresses } from "./getters/get-contract-addresses";
import { getDisputeInfo } from "./getters/get-dispute-info";
import { getInitialReporters } from "./getters/get-initial-reporters";
import { getForkMigrationTotals } from "./getters/get-fork-migration-totals";
import { getReportingFees } from "./getters/get-reporting-fees";

export function dispatchJsonRpcRequest(db: Knex, request: JsonRpcRequest, augur: Augur, callback: (err?: Error|null, result?: any) => void): void {
  console.log(request);
  switch (request.method) {
    case "getAccountTransferHistory":
      return getAccountTransferHistory(db, request.params.account, request.params.token, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getCategories":
      return getCategories(db, request.params.universe, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketsInCategory":
      return getMarketsInCategory(db, request.params.universe, request.params.category, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketsCreatedByUser":
      return getMarketsCreatedByUser(db, request.params.universe, request.params.creator, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getReportingHistory":
      return getReportingHistory(db, request.params.reporter, request.params.universe, request.params.marketId, request.params.reportingWindow, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getReportingSummary":
      return getReportingSummary(db, request.params.reportingWindow, callback);
    case "getUserTradingHistory":
      return getUserTradingHistory(db, request.params.universe, request.params.account, request.params.marketId, request.params.outcome, request.params.orderType, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketPriceHistory":
      return getMarketPriceHistory(db, request.params.marketId, callback);
    case "getUserTradingPositions":
      return getUserTradingPositions(db, request.params.universe, request.params.account, request.params.marketId, request.params.outcome, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getFeeWindowCurrent":
      return getFeeWindowCurrent(db, request.params.universe, request.params.account, callback);
    case "getFeeWindows":
      return getFeeWindows(db, augur, request.params.universe, request.params.account, request.params.includeCurrent, callback);
    case "getUnclaimedMarketCreatorFees":
      return getUnclaimedMarketCreatorFees(db, request.params.marketIds, callback);
    case "getDisputeTokens":
      return getDisputeTokens(db, request.params.universe, request.params.account, request.params.stakeTokenState, callback);
    case "getDisputeInfo":
      return getDisputeInfo(db, request.params.marketIds, request.params.account, callback);
    case "getInitialReporters":
      return getInitialReporters(db, augur, request.params.reporter, request.params.redeemed, request.params.withRepBalance, callback);
    case "getReportingFees":
      return getReportingFees(db, augur, request.params.reporter, request.params.universe, request.params.feeWindow, callback);
    case "getForkMigrationTotals":
      return getForkMigrationTotals(db, augur, request.params.parentUniverse, callback);
    case "getMarketsClosingInDateRange":
      return getMarketsClosingInDateRange(db, request.params.earliestClosingTime, request.params.latestClosingTime, request.params.universe, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarkets":
      return getMarkets(db, request.params.universe, request.params.creator, request.params.category, request.params.reportingState, request.params.feeWindow, request.params.designatedReporter, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketsInfo":
      return getMarketsInfo(db, request.params.marketIds, callback);
    case "getOrders":
      return getOrders(db, request.params.universe, request.params.marketId, request.params.outcome, request.params.orderType, request.params.creator, request.params.orderState, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getBetterWorseOrders":
      return getBetterWorseOrders(db, request.params.marketId, request.params.outcome, request.params.orderType, request.params.price, callback);
    case "getContractAddresses":
      return getContractAddresses(augur, callback);
    default:
      callback(new Error("unknown json rpc method"));
  }
}
