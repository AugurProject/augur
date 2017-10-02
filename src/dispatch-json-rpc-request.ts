import { SqlLiteDb, JsonRpcRequest } from "./types";
import { getMarketInfo } from "./get-market-info";
import { getAccountTransferHistory } from "./get-account-transfer-history";
import { getMarketsCreatedByUser } from "./get-markets-created-by-user";
import { getReportingHistory } from "./get-reporting-history";
import { getMarketsAwaitingDesignatedReporting } from "./get-markets-awaiting-designated-reporting";
import { getMarketsAwaitingLimitedReporting } from "./get-markets-awaiting-limited-reporting";
import { getMarketsAwaitingAllReporting } from "./get-markets-awaiting-all-reporting";
import { getDisputableMarkets } from "./get-disputable-markets";
import { getReportingSummary } from "./get-reporting-summary";
import { getUserTradingHistory } from "./get-user-trading-history";
import { getUserTradingPositions } from "./get-user-trading-positions";
import { getClosedOrders } from "./get-closed-orders";
import { getReportingWindowsWithUnclaimedFees } from "./get-reporting-windows-with-unclaimed-fees";
import { getUnclaimedReportingTokens } from "./get-unclaimed-reporting-tokens";
import { getUnfinalizedReportingTokens } from "./get-unfinalized-reporting-tokens";
import { getAllReportingTokens } from "./get-all-reporting-tokens";
import { getMarketsClosingInDateRange } from "./get-markets-closing-in-date-range";
import { getDetailedMarketInfo } from "./get-detailed-market-info";
import { getMarketsInfo } from "./get-markets-info";
import { getOpenOrders } from "./get-open-orders";

export function dispatchJsonRpcRequest(db: SqlLiteDb, request: JsonRpcRequest, callback: (err?: Error|null, result?: any) => void) {
  switch (request.method) {
    case "getMarketInfo":
      return getMarketInfo(db, request.params.market, callback);
    case "getAccountTransferHistory":
      return getAccountTransferHistory(db, request.params.account, request.params.token, callback);
    case "getMarketsCreatedByUser":
      return getMarketsCreatedByUser(db, request.params.account, callback);
    case "getReportingHistory":
      return getReportingHistory(db, request.params.account, request.params.market, request.params.universe, request.params.reportingWindow, callback);
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
      return getUserTradingHistory(db, request.params.account, request.params.market, request.params.outcome, request.params.orderType, callback);
    case "getUserTradingPositions":
      return getUserTradingPositions(db, request.params.account, request.params.market, request.params.outcome, callback);
    case "getClosedOrders":
      return getClosedOrders(db, request.params.account, request.params.dateRange, callback);
    case "getReportingWindowsWithUnclaimedFees":
      return getReportingWindowsWithUnclaimedFees(db, request.params.account, callback);
    case "getUnclaimedReportingTokens":
      return getUnclaimedReportingTokens(db, request.params.account, callback);
    case "getUnfinalizedReportingTokens":
      return getUnfinalizedReportingTokens(db, request.params.account, callback);
    case "getAllReportingTokens":
      return getAllReportingTokens(db, request.params.account, request.params.dateRange, callback);
    case "getMarketsClosingInDateRange":
      return getMarketsClosingInDateRange(db, request.params.dateRange, callback);
    case "getDetailedMarketInfo":
      return getDetailedMarketInfo(db, request.params.market, callback);
    case "getMarketsInfo":
      return getMarketsInfo(db, request.params.universe, callback);
    case "getOpenOrders":
      return getOpenOrders(db, request.params.market, request.params.outcome, request.params.orderType, request.params.creator, callback);
    default:
      callback(new Error("unknown json rpc method"));
  }
}
