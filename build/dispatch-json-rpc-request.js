"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_market_info_1 = require("./get-market-info");
const get_account_transfer_history_1 = require("./get-account-transfer-history");
const get_topics_1 = require("./get-topics");
const get_markets_created_by_user_1 = require("./get-markets-created-by-user");
const get_reporting_history_1 = require("./get-reporting-history");
const get_markets_awaiting_designated_reporting_1 = require("./get-markets-awaiting-designated-reporting");
const get_markets_awaiting_limited_reporting_1 = require("./get-markets-awaiting-limited-reporting");
const get_markets_awaiting_all_reporting_1 = require("./get-markets-awaiting-all-reporting");
const get_disputable_markets_1 = require("./get-disputable-markets");
const get_reporting_summary_1 = require("./get-reporting-summary");
const get_user_trading_history_1 = require("./get-user-trading-history");
const get_user_trading_positions_1 = require("./get-user-trading-positions");
const get_closed_orders_1 = require("./get-closed-orders");
const get_reporting_windows_with_unclaimed_fees_1 = require("./get-reporting-windows-with-unclaimed-fees");
const get_unclaimed_reporting_tokens_1 = require("./get-unclaimed-reporting-tokens");
const get_unfinalized_reporting_tokens_1 = require("./get-unfinalized-reporting-tokens");
const get_all_reporting_tokens_1 = require("./get-all-reporting-tokens");
const get_markets_closing_in_date_range_1 = require("./get-markets-closing-in-date-range");
const get_detailed_market_info_1 = require("./get-detailed-market-info");
const get_markets_info_1 = require("./get-markets-info");
const get_open_orders_1 = require("./get-open-orders");
function dispatchJsonRpcRequest(db, request, callback) {
    console.log("dispatchJsonRpcRequest:", request);
    switch (request.method) {
        case "getMarketInfo":
            return get_market_info_1.getMarketInfo(db, request.params.market, callback);
        case "getAccountTransferHistory":
            return get_account_transfer_history_1.getAccountTransferHistory(db, request.params.account, request.params.token, callback);
        case "getTopics":
            return get_topics_1.getTopics(db, request.params.universe, callback);
        case "getMarketsCreatedByUser":
            return get_markets_created_by_user_1.getMarketsCreatedByUser(db, request.params.account, callback);
        case "getReportingHistory":
            return get_reporting_history_1.getReportingHistory(db, request.params.account, request.params.market, request.params.universe, request.params.reportingWindow, callback);
        case "getMarketsAwaitingDesignatedReporting":
            return get_markets_awaiting_designated_reporting_1.getMarketsAwaitingDesignatedReporting(db, request.params.designatedReporter, callback);
        case "getMarketsAwaitingLimitedReporting":
            return get_markets_awaiting_limited_reporting_1.getMarketsAwaitingLimitedReporting(db, request.params.reportingWindow, callback);
        case "getMarketsAwaitingAllReporting":
            return get_markets_awaiting_all_reporting_1.getMarketsAwaitingAllReporting(db, request.params.reportingWindow, callback);
        case "getDisputableMarkets":
            return get_disputable_markets_1.getDisputableMarkets(db, request.params.reportingWindow, callback);
        case "getReportingSummary":
            return get_reporting_summary_1.getReportingSummary(db, request.params.reportingWindow, callback);
        case "getUserTradingHistory":
            return get_user_trading_history_1.getUserTradingHistory(db, request.params.account, request.params.market, request.params.outcome, request.params.orderType, callback);
        case "getUserTradingPositions":
            return get_user_trading_positions_1.getUserTradingPositions(db, request.params.account, request.params.market, request.params.outcome, callback);
        case "getClosedOrders":
            return get_closed_orders_1.getClosedOrders(db, request.params.account, request.params.dateRange, callback);
        case "getReportingWindowsWithUnclaimedFees":
            return get_reporting_windows_with_unclaimed_fees_1.getReportingWindowsWithUnclaimedFees(db, request.params.account, callback);
        case "getUnclaimedReportingTokens":
            return get_unclaimed_reporting_tokens_1.getUnclaimedReportingTokens(db, request.params.account, callback);
        case "getUnfinalizedReportingTokens":
            return get_unfinalized_reporting_tokens_1.getUnfinalizedReportingTokens(db, request.params.account, callback);
        case "getAllReportingTokens":
            return get_all_reporting_tokens_1.getAllReportingTokens(db, request.params.account, request.params.dateRange, callback);
        case "getMarketsClosingInDateRange":
            return get_markets_closing_in_date_range_1.getMarketsClosingInDateRange(db, request.params.dateRange, callback);
        case "getDetailedMarketInfo":
            return get_detailed_market_info_1.getDetailedMarketInfo(db, request.params.market, callback);
        case "getMarketsInfo":
            return get_markets_info_1.getMarketsInfo(db, request.params.universe, callback);
        case "getOpenOrders":
            return get_open_orders_1.getOpenOrders(db, request.params.market, request.params.outcome, request.params.orderType, request.params.creator, callback);
        default:
            callback(new Error("unknown json rpc method"));
    }
}
exports.dispatchJsonRpcRequest = dispatchJsonRpcRequest;
//# sourceMappingURL=dispatch-json-rpc-request.js.map