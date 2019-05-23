import accountPositions from "modules/positions/reducers/account-positions";
import appStatus from "modules/app/reducers/app-status";
import sidebarStatus from "modules/app/reducers/sidebar-status";
import authStatus from "modules/auth/reducers/auth-status";
import blockchain from "modules/app/reducers/blockchain";
import categories from "modules/categories/reducers/categories-data";
import connection from "modules/app/reducers/connection";
import env from "modules/app/reducers/env";
import favorites from "modules/markets/reducers/favorites";
import filterSortOptions from "modules/filter-sort/reducers/filter-sort-options";
import gasPriceInfo from "modules/app/reducers/gas-price-info";
import loginAccount from "modules/auth/reducers/login-account";
import marketTradingHistory from "modules/markets/reducers/market-trading-history";
import marketReportState from "modules/reports/reducers/market-report-state";
import marketsData from "modules/markets/reducers/markets-data";
import modal from "modules/modal/reducers/modal";
import newMarket from "modules/markets/reducers/new-market";
import alerts from "modules/alerts/reducers/alerts";
import orderBooks from "modules/orders/reducers/order-books";
import orderCancellation from "modules/orders/reducers/order-cancellation";
import outcomesData from "modules/markets/reducers/outcomes-data";
import pendingLiquidityOrders from "modules/orders/reducers/liquidity-orders";
import reportingWindowStats from "modules/reports/reducers/reporting-window-stats";
import reports from "modules/reports/reducers/reports";
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
    accountPositions,
    alerts,
    appStatus,
    authStatus,
    blockchain,
    categories,
    connection,
    env,
    favorites,
    filterSortOptions,
    gasPriceInfo,
    loginAccount,
    marketReportState,
    marketTradingHistory,
    marketsData,
    modal,
    newMarket,
    readNotifications,
    orderBooks,
    orderCancellation,
    outcomesData,
    pendingLiquidityOrders,
    pendingOrders,
    pendingQueue,
    filledOrders,
    reportingWindowStats,
    reports,
    sidebarStatus,
    transactionsData,
    transactionsStatus,
    universe,
    versions,
    accountShareBalances
  };
}
