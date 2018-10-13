import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as Knex from "knex";
import Augur from "augur.js";
import { logger } from "../utils/logger";
import { JsonRpcRequest } from "../types";
import { AccountTransferHistoryParams, getAccountTransferHistory } from "./getters/get-account-transfer-history";
import { CategoriesParams, getCategories } from "./getters/get-categories";
import { getMarketsCreatedByUser } from "./getters/get-markets-created-by-user";
import { getReportingHistory, ReportingHistoryParams } from "./getters/get-reporting-history";
import { getReportingSummary, ReportingSummaryParams } from "./getters/get-reporting-summary";
import { getTradingHistory, TradingHistoryParams } from "./getters/get-trading-history";
import { getMarketPriceHistory, MarketPriceHistoryParams } from "./getters/get-market-price-history";
import { getMarketPriceCandlesticks, MarketPriceCandlesticksParams } from "./getters/get-market-price-candlesticks";
import { getUserTradingPositions, UserTradingPositionsParams } from "./getters/get-user-trading-positions";
import { getUserShareBalances } from "./getters/get-user-share-balances";
import { FeeWindowsParams, getFeeWindows } from "./getters/get-fee-windows";
import { FeeWindowParams, getFeeWindow } from "./getters/get-fee-window";
import { getUnclaimedMarketCreatorFees, UnclaimedMarketCreatorFeesParams } from "./getters/get-unclaimed-market-creator-fees";
import { DisputeTokensParams, getDisputeTokens } from "./getters/get-dispute-tokens";
import { getMarkets, GetMarketsParams } from "./getters/get-markets";
import { getMarketsClosingInDateRange, MarketsClosingInDateRangeParams } from "./getters/get-markets-closing-in-date-range";
import { getMarketsInfo, MarketsInfoParams } from "./getters/get-markets-info";
import { getOrders, OrdersParams } from "./getters/get-orders";
import { getAllOrders } from "./getters/get-all-orders";
import { getCompleteSets } from "./getters/get-complete-sets";
import { getBetterWorseOrders } from "./getters/get-better-worse-orders";
import { getSyncData, NoParams } from "./getters/get-sync-data";
import { DisputeInfoParams, getDisputeInfo } from "./getters/get-dispute-info";
import { getInitialReporters, InitialReportersParams } from "./getters/get-initial-reporters";
import { ForkMigrationTotalsParams, getForkMigrationTotals } from "./getters/get-fork-migration-totals";
import { getReportingFees, ReportingFeesParams } from "./getters/get-reporting-fees";
import { getUniversesInfo } from "./getters/get-universes-info";
import { getProfitLoss } from "./getters/get-profit-loss";
import { getWinningBalance, WinningBalanceParams } from "./getters/get-winning-balance";

type GetterFunction<T, R> = (db: Knex, augur: Augur, params: T) => Promise<R>;

export function dispatchJsonRpcRequest(db: Knex, request: JsonRpcRequest, augur: Augur, callback: (err?: Error|null, result?: any) => void): void {
  logger.info(JSON.stringify(request));

  function dispatchResponse<T, R>(getterFunction: GetterFunction<T, R>, decodedParams: t.Validation<T>) {
    if (decodedParams.isRight()) {
      getterFunction(db, augur, decodedParams.value).then((response) => {
        callback(null, response);
      }).catch(callback);
      return;
    } else {
      return callback(new Error(`Invalid request object: ${PathReporter.report(decodedParams)}`));
    }
  }

  switch (request.method) {
    case "getDisputeInfo":
      return dispatchResponse(getDisputeInfo, DisputeInfoParams.decode(request.params));
    case "getReportingSummary":
      return dispatchResponse(getReportingSummary, ReportingSummaryParams.decode(request.params));
    case "getMarketPriceHistory":
      return dispatchResponse(getMarketPriceHistory, MarketPriceHistoryParams.decode(request.params));
    case "getCategories":
      return dispatchResponse(getCategories, CategoriesParams.decode(request.params));
    case "getContractAddresses":
    case "getSyncData":
      return dispatchResponse(getSyncData, NoParams.decode({}));
    case "getMarketsClosingInDateRange":
      return dispatchResponse(getMarketsClosingInDateRange, MarketsClosingInDateRangeParams.decode(request.params));
    case "getMarketsInfo":
      return dispatchResponse(getMarketsInfo, MarketsInfoParams.decode(request.params));
    case "getAccountTransferHistory":
      return dispatchResponse(getAccountTransferHistory, AccountTransferHistoryParams.decode(request.params));
    case "getReportingHistory":
      return dispatchResponse(getReportingHistory, ReportingHistoryParams.decode(request.params));
    case "getTradingHistory":
      return dispatchResponse(getTradingHistory, TradingHistoryParams.decode(request.params));
    case "getMarketPriceCandlesticks":
      return dispatchResponse(getMarketPriceCandlesticks, MarketPriceCandlesticksParams.decode(request.params));
    case "getUserTradingPositions":
      return dispatchResponse(getUserTradingPositions, UserTradingPositionsParams.decode(request.params));
    case "getFeeWindowCurrent":
      return dispatchResponse(getFeeWindow, FeeWindowParams.decode(Object.assign({feeWindowState: "current" }, request.params)));
    case "getFeeWindow":
      return dispatchResponse(getFeeWindow, FeeWindowParams.decode(request.params));
    case "getFeeWindows":
      return dispatchResponse(getFeeWindows, FeeWindowsParams.decode(request.params));
    case "getUnclaimedMarketCreatorFees":
      return dispatchResponse(getUnclaimedMarketCreatorFees, UnclaimedMarketCreatorFeesParams.decode(request.params));
    case "getWinningBalance":
      return dispatchResponse(getWinningBalance, WinningBalanceParams.decode(request.params));
    case "getDisputeTokens":
      return dispatchResponse(getDisputeTokens, DisputeTokensParams.decode(request.params));
    case "getInitialReporters":
      return dispatchResponse(getInitialReporters, InitialReportersParams.decode(request.params));
    case "getReportingFees":
      return dispatchResponse(getReportingFees, ReportingFeesParams.decode(request.params) );
    case "getForkMigrationTotals":
      return dispatchResponse(getForkMigrationTotals, ForkMigrationTotalsParams.decode(request.params));
    case "getMarkets":
      return dispatchResponse(getMarkets, GetMarketsParams.decode(request.params));
    case "getOrders":
      return dispatchResponse(getOrders, OrdersParams.decode(request.params));

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

    case "getMarketsCreatedByUser":
      return getMarketsCreatedByUser(db, request.params.universe, request.params.creator, request.params.earliestCreationTime, request.params.latestCreationTime, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);
    default:
      callback(new Error("unknown json rpc method"));
  }
}
