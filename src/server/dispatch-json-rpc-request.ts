import * as Knex from "knex";
import Augur from "augur.js";
import { JsonRpcRequest } from "../types";
import { getAccountTransferHistory } from "./getters/get-account-transfer-history";
import { getCategories } from "./getters/get-categories";
import { getMarketsInCategory } from "./getters/get-markets-in-category";
import { getMarketsCreatedByUser } from "./getters/get-markets-created-by-user";
import { getReportingHistory } from "./getters/get-reporting-history";
import { getMarketsAwaitingDesignatedReporting } from "./getters/get-markets-awaiting-designated-reporting";
import { getMarketsAwaitingReporting } from "./getters/get-markets-awaiting-reporting";
import { getDisputableMarkets } from "./getters/get-disputable-markets";
import { getReportingSummary } from "./getters/get-reporting-summary";
import { getUserTradingHistory } from "./getters/get-user-trading-history";
import { getMarketPriceHistory } from "./getters/get-market-price-history";
import { getUserTradingPositions } from "./getters/get-user-trading-positions";
import { getFeeWindowsWithUnclaimedFees } from "./getters/get-fee-windows-with-unclaimed-fees";
import { getFeeWindowCurrent } from "./getters/get-fee-window-current";
import { getUnclaimedMarketCreatorFees } from "./getters/get-unclaimed-market-creator-fees";
import { getDisputeTokens } from "./getters/get-dispute-tokens";
import { getMarkets } from "./getters/get-markets";
import { getMarketsClosingInDateRange } from "./getters/get-markets-closing-in-date-range";
import { getMarketsInfo } from "./getters/get-markets-info";
import { getOrders } from "./getters/get-orders";
import { getBetterWorseOrders } from "./getters/get-better-worse-orders";
import { getContractAddresses } from "./getters/get-contract-addresses";

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
      return getReportingHistory(db, request.params.reporter, request.params.universe, request.params.marketID, request.params.reportingWindow, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketsAwaitingDesignatedReporting":
      return getMarketsAwaitingDesignatedReporting(db, request.params.universe, request.params.designatedReporter, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketsAwaitingReporting":
      return getMarketsAwaitingReporting(db, request.params.universe, request.params.reportingWindow, request.params.reportingRound, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getDisputableMarkets":
      return getDisputableMarkets(db, request.params.reportingWindow, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getReportingSummary":
      return getReportingSummary(db, request.params.reportingWindow, callback);
    case "getUserTradingHistory":
      return getUserTradingHistory(db, request.params.universe, request.params.account, request.params.marketID, request.params.outcome, request.params.orderType, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketPriceHistory":
      return getMarketPriceHistory(db, request.params.marketID, callback);
    case "getUserTradingPositions":
      return getUserTradingPositions(db, request.params.universe, request.params.account, request.params.marketID, request.params.outcome, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getFeeWindowCurrent":
      return getFeeWindowCurrent(db, request.params.universe, callback);
    case "getFeeWindowsWithUnclaimedFees":
      return getFeeWindowsWithUnclaimedFees(db, request.params.universe, request.params.account, callback);
    case "getUnclaimedMarketCreatorFees":
      return getUnclaimedMarketCreatorFees(db, request.params.marketIDs, callback);
    case "getStakeTokens":
      return getDisputeTokens(db, request.params.universe, request.params.account, request.params.stakeTokenState, callback);
    case "getMarketsClosingInDateRange":
      return getMarketsClosingInDateRange(db, request.params.earliestClosingTime, request.params.latestClosingTime, request.params.universe, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarkets":
      return getMarkets(db, request.params.universe, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getMarketsInfo":
      return getMarketsInfo(db, request.params.marketIDs, callback);
    case "getOrders":
      return getOrders(db, request.params.universe, request.params.marketID, request.params.outcome, request.params.orderType, request.params.creator, request.params.orderState, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    case "getBetterWorseOrders":
      return getBetterWorseOrders(db, request.params.marketID, request.params.outcome, request.params.orderType, request.params.price, callback);
    case "getContractAddresses":
      return getContractAddresses(augur, callback);
    default:
      callback(new Error("unknown json rpc method"));
  }
}
