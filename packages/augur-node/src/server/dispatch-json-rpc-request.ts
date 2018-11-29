import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as Knex from "knex";
import Augur from "augur.js";
import { logger } from "../utils/logger";
import { JsonRpcRequest } from "../types";
import { AccountTransferHistoryParams, getAccountTransferHistory } from "./getters/get-account-transfer-history";
import { getReportingHistory, ReportingHistoryParams } from "./getters/get-reporting-history";
import { getReportingSummary, ReportingSummaryParams } from "./getters/get-reporting-summary";
import { getTradingHistory, TradingHistoryParams } from "./getters/get-trading-history";
import { getMarketPriceHistory, MarketPriceHistoryParams } from "./getters/get-market-price-history";
import { getMarketPriceCandlesticks, MarketPriceCandlesticksParams } from "./getters/get-market-price-candlesticks";
import { getUserTradingPositions, UserTradingPositionsParams } from "./getters/get-user-trading-positions";
import { getUserShareBalances, UserShareBalancesParams } from "./getters/get-user-share-balances";
import { DisputeWindowsParams, getDisputeWindows } from "./getters/get-dispute-windows";
import { DisputeWindowParams, getDisputeWindow } from "./getters/get-dispute-window";
import { getUnclaimedMarketCreatorFees, UnclaimedMarketCreatorFeesParams } from "./getters/get-unclaimed-market-creator-fees";
import { DisputeTokensParams, getDisputeTokens } from "./getters/get-dispute-tokens";
import { getMarkets, GetMarketsParams } from "./getters/get-markets";
import { getMarketsClosingInDateRange, MarketsClosingInDateRangeParams } from "./getters/get-markets-closing-in-date-range";
import { getMarketsInfo, MarketsInfoParams } from "./getters/get-markets-info";
import { getOrders, OrdersParams } from "./getters/get-orders";
import { AllOrdersParams, getAllOrders } from "./getters/get-all-orders";
import { CompleteSetsParams, getCompleteSets } from "./getters/get-complete-sets";
import { BetterWorseOrdersParams, getBetterWorseOrders } from "./getters/get-better-worse-orders";
import { getSyncData, NoParams } from "./getters/get-sync-data";
import { DisputeInfoParams, getDisputeInfo } from "./getters/get-dispute-info";
import { getInitialReporters, InitialReportersParams } from "./getters/get-initial-reporters";
import { ForkMigrationTotalsParams, getForkMigrationTotals } from "./getters/get-fork-migration-totals";
import { getReportingFees, ReportingFeesParams } from "./getters/get-reporting-fees";
import { getUniversesInfo, UniverseInfoParams } from "./getters/get-universes-info";
import { getProfitLoss } from "./getters/get-profit-loss";
import { getWinningBalance, WinningBalanceParams } from "./getters/get-winning-balance";
import { getCategories, CategoriesParams } from "./getters/get-categories";

type GetterFunction<T, R> = (db: Knex, augur: Augur, params: T) => Promise<R>;

export function dispatchJsonRpcRequest(db: Knex, request: JsonRpcRequest, augur: Augur): Promise<any> {
  logger.info(JSON.stringify(request));

  function dispatchResponse<T, R>(getterFunction: GetterFunction<T, R>, decodedParams: t.Validation<T>): Promise<any> {
    if (decodedParams.isRight()) {
      return getterFunction(db, augur, decodedParams.value);
    } else {
      throw new Error(`Invalid request object: ${PathReporter.report(decodedParams)}`);
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
    case "getDisputeWindowCurrent":
      return dispatchResponse(getDisputeWindow, DisputeWindowParams.decode(Object.assign({disputeWindowState: "current" }, request.params)));
    case "getDisputeWindow":
      return dispatchResponse(getDisputeWindow, DisputeWindowParams.decode(request.params));
    case "getDisputeWindows":
      return dispatchResponse(getDisputeWindows, DisputeWindowsParams.decode(request.params));
    case "getUnclaimedMarketCreatorFees":
      return dispatchResponse(getUnclaimedMarketCreatorFees, UnclaimedMarketCreatorFeesParams.decode(request.params));
    case "getWinningBalance":
      return dispatchResponse(getWinningBalance, WinningBalanceParams.decode(request.params));
    case "getDisputeTokens":
      return dispatchResponse(getDisputeTokens, DisputeTokensParams.decode(request.params));
    case "getInitialReporters":
      return dispatchResponse(getInitialReporters, InitialReportersParams.decode(request.params));
    case "getReportingFees":
      return dispatchResponse(getReportingFees, ReportingFeesParams.decode(request.params));
    case "getForkMigrationTotals":
      return dispatchResponse(getForkMigrationTotals, ForkMigrationTotalsParams.decode(request.params));
    case "getMarkets":
      return dispatchResponse(getMarkets, GetMarketsParams.decode(request.params));
    case "getOrders":
      return dispatchResponse(getOrders, OrdersParams.decode(request.params));
    case "getAllOrders":
      return dispatchResponse(getAllOrders, AllOrdersParams.decode(request.params));
    case "getBetterWorseOrders":
      return dispatchResponse(getBetterWorseOrders, BetterWorseOrdersParams.decode(request.params));
    case "getCompleteSets":
      return dispatchResponse(getCompleteSets, CompleteSetsParams.decode(request.params));
    case "getUniversesInfo":
      return dispatchResponse(getUniversesInfo, UniverseInfoParams.decode(request.params));
    case "getUserShareBalances":
      return dispatchResponse(getUserShareBalances, UserShareBalancesParams.decode(request.params));

    case "getProfitLoss":
      return new Promise((resolve, reject) => {
        getProfitLoss(db, augur, request.params.universe, request.params.account, request.params.startTime, request.params.endTime, request.params.periodInterval, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    default:
      throw new Error(`unknown json rpc method ${request.method}`);
  }
}
