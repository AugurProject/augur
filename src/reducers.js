import accountDisputes from "modules/reports/reducers/account-disputes-state";
import accountPositions from "modules/positions/reducers/account-positions";
import accountTrades from "modules/positions/reducers/account-trades";
import appStatus from "modules/app/reducers/app-status";
import authStatus from "modules/auth/reducers/auth-status";
import blockchain from "modules/app/reducers/blockchain";
import categories from "modules/categories/reducers/categories-data";
import connection from "modules/app/reducers/connection";
import contractAddresses from "modules/contracts/reducers/contract-addresses";
import disputeCrowdsourcerTokens from "modules/reports/reducers/dispute-crowdsourcer-data";
import env from "modules/app/reducers/env";
import eventsAPI from "modules/contracts/reducers/events-api";
import favorites from "modules/markets/reducers/favorites";
import filterSortOptions from "modules/filter-sort/reducers/filter-sort-options";
import functionsAPI from "modules/contracts/reducers/functions-api";
import gasPriceInfo from "modules/app/reducers/gas-price-info";
import initialReporters from "modules/reports/reducers/initial-reporters-data";
import isFirstOrderBookChunkLoaded from "modules/orders/reducers/is-first-order-book-chunk-loaded";
import loginAccount from "modules/auth/reducers/login-account";
import marketCreatorFees from "modules/markets/reducers/market-creator-fees";
import marketLoading from "modules/markets/reducers/market-loading";
import marketTradingHistory from "modules/markets/reducers/market-trading-history";
import marketReportState from "modules/reports/reducers/market-report-state";
import marketsData from "modules/markets/reducers/markets-data";
import marketsWithAccountReport from "modules/reports/reducers/markets-with-account-report";
import modal from "modules/modal/reducers/modal";
import newMarket from "modules/markets/reducers/new-market";
import notifications from "modules/notifications/reducers/notifications";
import orderBooks from "modules/orders/reducers/order-books";
import orderCancellation from "modules/orders/reducers/order-cancellation";
import orphanedOrders from "modules/orders/reducers/orphaned-orders";
import outcomesData from "modules/markets/reducers/outcomes-data";
import participationTokens from "modules/reports/reducers/participation-token-data";
import priceHistory from "modules/markets/reducers/price-history";
import pendingLiquidityOrders from "modules/orders/reducers/liquidity-orders";
import reportingWindowStats from "modules/reports/reducers/reporting-window-stats";
import reports from "modules/reports/reducers/reports";
import scalarMarketsShareDenomination from "modules/markets/reducers/scalar-markets-share-denomination";
import selectedMarketId from "modules/markets/reducers/selected-market-id";
import tradesInProgress from "modules/trades/reducers/trades-in-progress";
import transactionsData from "modules/transactions/reducers/transactions-data";
import transactionsStatus from "modules/transactions/reducers/transactions-status";
import universe from "modules/universe/reducers/universe";
import versions from "modules/app/reducers/versions";

export function createReducer() {
  return {
    accountDisputes,
    accountPositions,
    accountTrades,
    appStatus,
    authStatus,
    blockchain,
    categories,
    connection,
    contractAddresses,
    disputeCrowdsourcerTokens,
    env,
    eventsAPI,
    favorites,
    filterSortOptions,
    functionsAPI,
    gasPriceInfo,
    initialReporters,
    isFirstOrderBookChunkLoaded,
    loginAccount,
    marketCreatorFees,
    marketLoading,
    marketReportState,
    marketTradingHistory,
    marketsData,
    marketsWithAccountReport,
    modal,
    newMarket,
    notifications,
    orderBooks,
    orderCancellation,
    orphanedOrders,
    outcomesData,
    participationTokens,
    pendingLiquidityOrders,
    priceHistory,
    reportingWindowStats,
    reports,
    scalarMarketsShareDenomination,
    selectedMarketId,
    tradesInProgress,
    transactionsData,
    transactionsStatus,
    universe,
    versions
  };
}
