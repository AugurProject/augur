import accountDisputes from "modules/reports/reducers/account-disputes-state";
import accountPositions from "modules/positions/reducers/account-positions";
import appStatus from "modules/app/reducers/app-status";
import sidebarStatus from "modules/app/reducers/sidebar-status";
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
import loginAccount from "modules/auth/reducers/login-account";
import marketCreatorFees from "modules/markets/reducers/market-creator-fees";
import marketTradingHistory from "modules/markets/reducers/market-trading-history";
import marketReportState from "modules/reports/reducers/market-report-state";
import marketsData from "modules/markets/reducers/markets-data";
import marketsWithAccountReport from "modules/reports/reducers/markets-with-account-report";
import modal from "modules/modal/reducers/modal";
import newMarket from "modules/markets/reducers/new-market";
import alerts from "modules/alerts/reducers/alerts";
import orderBooks from "modules/orders/reducers/order-books";
import orderCancellation from "modules/orders/reducers/order-cancellation";
import orphanedOrders from "modules/orders/reducers/orphaned-orders";
import outcomesData from "modules/markets/reducers/outcomes-data";
import participationTokens from "modules/reports/reducers/participation-token-data";
import pendingLiquidityOrders from "modules/orders/reducers/liquidity-orders";
import reportingWindowStats from "modules/reports/reducers/reporting-window-stats";
import reports from "modules/reports/reducers/reports";
import scalarMarketsShareDenomination from "modules/markets/reducers/scalar-markets-share-denomination";
import selectedMarketId from "modules/markets/reducers/selected-market-id";
import transactionsData from "modules/transactions/reducers/transactions-data";
import transactionsStatus from "modules/transactions/reducers/transactions-status";
import universe from "modules/universe/reducers/universe";
import versions from "modules/app/reducers/versions";
import pendingOrders from "modules/orders/reducers/pending-orders";
import filledOrders from "modules/orders/reducers/filled-orders";
import accountShareBalances from "modules/positions/reducers/account-share-balances";
import readNotifications from "modules/notifications/reducers/read-notifications";
import pendingQueue from "modules/pending-queue/reducers/pending-queue";

export function createReducer() {
  return {
    accountDisputes,
    accountPositions,
    alerts,
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
    loginAccount,
    marketCreatorFees,
    marketReportState,
    marketTradingHistory,
    marketsData,
    marketsWithAccountReport,
    modal,
    newMarket,
    readNotifications,
    orderBooks,
    orderCancellation,
    orphanedOrders,
    outcomesData,
    participationTokens,
    pendingLiquidityOrders,
    pendingOrders,
    pendingQueue,
    filledOrders,
    reportingWindowStats,
    reports,
    scalarMarketsShareDenomination,
    selectedMarketId,
    sidebarStatus,
    transactionsData,
    transactionsStatus,
    universe,
    versions,
    accountShareBalances
  };
}
