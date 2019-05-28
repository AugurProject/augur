import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import Knex from "knex";
import { Augur, JsonRpcRequest } from "../types";
import { logger } from "../utils/logger";
import {
  AccountTimeRangedStatsParams,
  AccountTransferHistoryParams,
  AllOrdersParams,
  BetterWorseOrdersParams, CategoriesParams,
  CompleteSetsParams,
  DisputeInfoParams,
  DisputeTokensParams,
  FeeWindowParams,
  ForkMigrationTotalsParams,
  getAccountTimeRangedStats,
  getAccountTransactionHistory,
  GetAccountTransactionHistoryParams, getAccountTransferHistory,
  getAllOrders, getBetterWorseOrders,
  getCategories,
  getCompleteSets,
  getDisputeInfo,
  getDisputeTokens,
  getFeeWindow, getForkMigrationTotals, getInitialReporters, getMarketPriceCandlesticks, getMarketPriceHistory,
  getMarkets,
  getMarketsClosingInDateRange,
  getMarketsInfo,
  GetMarketsParams,
  getOrders,
  getPlatformActivityStats, getProfitLoss,
  GetProfitLossParams,
  getProfitLossSummary,
  GetProfitLossSummaryParams, getReportingFees, getReportingHistory,
  getReportingSummary,
  getSyncData,
  getTradingHistory, getUnclaimedMarketCreatorFees,
  getUniversesInfo,
  getUserShareBalances,
  getUserTradingPositions, getWinningBalance,
  InitialReportersParams,
  MarketPriceCandlesticksParams,
  MarketPriceHistoryParams,
  MarketsClosingInDateRangeParams, MarketsInfoParams,
  NoParams, OrdersParams, PlatformActivityStatsParams,
  ReportingFeesParams, ReportingHistoryParams,
  ReportingSummaryParams,
  TradingHistoryParams,
  UnclaimedMarketCreatorFeesParams,
  UniverseInfoParams,
  UserShareBalancesParams,
  UserTradingPositionsParams,
  WinningBalanceParams
} from "./getters";

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
    case "getAccountTimeRangedStats":
      return dispatchResponse(getAccountTimeRangedStats, AccountTimeRangedStatsParams.decode(request.params));
    case "getPlatformActivityStats":
      return dispatchResponse(getPlatformActivityStats, PlatformActivityStatsParams.decode(request.params));
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
      return dispatchResponse(getFeeWindow, FeeWindowParams.decode(Object.assign({ feeWindowState: "current" }, request.params)));
    case "getFeeWindow":
      return dispatchResponse(getFeeWindow, FeeWindowParams.decode(request.params));
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
    case "getAccountTransactionHistory":
      return dispatchResponse(getAccountTransactionHistory, GetAccountTransactionHistoryParams.decode(request.params));
    case "getProfitLoss":
      return dispatchResponse(getProfitLoss, GetProfitLossParams.decode(request.params));
    case "getProfitLossSummary":
      return dispatchResponse(getProfitLossSummary, GetProfitLossSummaryParams.decode(request.params));
    default:
      throw new Error(`unknown json rpc method ${request.method}`);
  }
}
