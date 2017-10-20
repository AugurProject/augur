import * as Knex from "knex";
import { JsonRpcRequest } from "../types";
import { getMarketInfo } from "./getters/get-market-info";
import { getAccountTransferHistory } from "./getters/get-account-transfer-history";
import { getCategories } from "./getters/get-categories";
import { getMarketsInCategory } from "./getters/get-markets-in-category";
import { getMarketsCreatedByUser } from "./getters/get-markets-created-by-user";
import { getReportingHistory } from "./getters/get-reporting-history";
import { getMarketsAwaitingDesignatedReporting } from "./getters/get-markets-awaiting-designated-reporting";
import { getMarketsAwaitingLimitedReporting } from "./getters/get-markets-awaiting-limited-reporting";
import { getMarketsAwaitingAllReporting } from "./getters/get-markets-awaiting-all-reporting";
import { getDisputableMarkets } from "./getters/get-disputable-markets";
import { getReportingSummary } from "./getters/get-reporting-summary";
import { getUserTradingHistory } from "./getters/get-user-trading-history";
import { getMarketPriceHistory } from "./getters/get-market-price-history";
import { getUserTradingPositions } from "./getters/get-user-trading-positions";
import { getReportingWindowsWithUnclaimedFees } from "./getters/get-reporting-windows-with-unclaimed-fees";
import { getUnclaimedReportingTokens } from "./getters/get-unclaimed-reporting-tokens";
import { getUnfinalizedReportingTokens } from "./getters/get-unfinalized-reporting-tokens";
import { getAllReportingTokens } from "./getters/get-all-reporting-tokens";
import { getMarketsClosingInDateRange } from "./getters/get-markets-closing-in-date-range";
import { getDetailedMarketInfo } from "./getters/get-detailed-market-info";
import { getMarketsInfo } from "./getters/get-markets-info";
import { getOpenOrders } from "./getters/get-open-orders";

export function dispatchJsonRpcRequest(db: Knex, request: JsonRpcRequest, callback: (err?: Error|null, result?: any) => void): void {
  console.log(request);
  switch (request.method) {
    case "getMarketInfo":
      return getMarketInfo(db, request.params.marketID, callback);
    case "getAccountTransferHistory":
      return getAccountTransferHistory(db, request.params.account, request.params.token, callback);
    case "getCategories":
      return getCategories(db, request.params.universe, callback);
    case "getMarketsInCategory":
      return getMarketsInCategory(db, request.params.category, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketsCreatedByUser":
      return getMarketsCreatedByUser(db, request.params.creator, callback);
    case "getReportingHistory":
      return getReportingHistory(db, request.params.reporter, request.params.marketID, request.params.universe, request.params.reportingWindow, callback);
    case "getMarketsAwaitingDesignatedReporting":
      return getMarketsAwaitingDesignatedReporting(db, request.params.designatedReporter, callback);
    case "getMarketsAwaitingLimitedReporting":
      return getMarketsAwaitingLimitedReporting(db, request.params.reportingWindow, callback);
    case "getMarketsAwaitingAllReporting":
      return getMarketsAwaitingAllReporting(db, request.params.reportingWindow, callback);
    case "getDisputableMarkets":
      return getDisputableMarkets(db, request.params.reportingWindow, callback);
    case "getReportingSummary":
      return getReportingSummary(db, request.params.reportingWindow, callback);
    case "getUserTradingHistory":
      return getUserTradingHistory(db, request.params.account, request.params.marketID, request.params.outcome, request.params.orderType, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketPriceHistory":
      return getMarketPriceHistory(db, request.params.marketID, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getUserTradingPositions":
      return getUserTradingPositions(db, request.params.account, request.params.marketID, request.params.outcome, callback);
    case "getReportingWindowsWithUnclaimedFees":
      return getReportingWindowsWithUnclaimedFees(db, request.params.account, callback);
    case "getUnclaimedReportingTokens":
      return getUnclaimedReportingTokens(db, request.params.account, callback);
    case "getUnfinalizedReportingTokens":
      return getUnfinalizedReportingTokens(db, request.params.account, callback);
    case "getAllReportingTokens":
      return getAllReportingTokens(db, request.params.account, request.params.dateRange, callback); // TODO change dateRange to separate earliestTime and latestTime params?
    case "getMarketsClosingInDateRange":
      return getMarketsClosingInDateRange(db, request.params.earliestClosingTime, request.params.latestClosingTime, request.params.universe, request.params.limit, callback);
    case "getDetailedMarketInfo":
      return getDetailedMarketInfo(db, request.params.marketID, callback);
    case "getMarketsInfo":
      return getMarketsInfo(db, request.params.universe, request.params.marketIDs, callback);
    case "getOpenOrders":
      return getOpenOrders(db, request.params.marketID, request.params.outcome, request.params.orderType, request.params.creator, callback);
    default:
      callback(new Error("unknown json rpc method"));
  }
}
