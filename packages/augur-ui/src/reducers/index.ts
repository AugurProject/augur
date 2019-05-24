import accountPositions from "packages/augur-ui/src/modules/positions/reducers/account-positions";
import appStatus from "packages/augur-ui/src/modules/app/reducers/app-status";
import sidebarStatus from "packages/augur-ui/src/modules/app/reducers/sidebar-status";
import authStatus from "packages/augur-ui/src/modules/auth/reducers/auth-status";
import blockchain from "packages/augur-ui/src/modules/app/reducers/blockchain";
import categories from "packages/augur-ui/src/modules/categories/reducers/categories-data";
import connection from "packages/augur-ui/src/modules/app/reducers/connection";
import env from "packages/augur-ui/src/modules/app/reducers/env";
import favorites from "packages/augur-ui/src/modules/markets/reducers/favorites";
import filterSortOptions from "packages/augur-ui/src/modules/filter-sort/reducers/filter-sort-options";
import gasPriceInfo from "packages/augur-ui/src/modules/app/reducers/gas-price-info";
import loginAccount from "packages/augur-ui/src/modules/auth/reducers/login-account";
import marketTradingHistory from "packages/augur-ui/src/modules/markets/reducers/market-trading-history";
import marketReportState from "packages/augur-ui/src/modules/reports/reducers/market-report-state";
import marketsData from "packages/augur-ui/src/modules/markets/reducers/markets-data";
import modal from "packages/augur-ui/src/modules/modal/reducers/modal";
import newMarket from "packages/augur-ui/src/modules/markets/reducers/new-market";
import alerts from "packages/augur-ui/src/modules/alerts/reducers/alerts";
import orderBooks from "packages/augur-ui/src/modules/orders/reducers/order-books";
import orderCancellation from "packages/augur-ui/src/modules/orders/reducers/order-cancellation";
import outcomesData from "packages/augur-ui/src/modules/markets/reducers/outcomes-data";
import pendingLiquidityOrders from "packages/augur-ui/src/modules/orders/reducers/liquidity-orders";
import reportingWindowStats from "packages/augur-ui/src/modules/reports/reducers/reporting-window-stats";
import reports from "packages/augur-ui/src/modules/reports/reducers/reports";
import transactionsData from "packages/augur-ui/src/modules/transactions/reducers/transactions-data";
import transactionsStatus from "packages/augur-ui/src/modules/transactions/reducers/transactions-status";
import universe from "packages/augur-ui/src/modules/universe/reducers/universe";
import versions from "packages/augur-ui/src/modules/app/reducers/versions";
import pendingOrders from "packages/augur-ui/src/modules/orders/reducers/pending-orders";
import filledOrders from "packages/augur-ui/src/modules/orders/reducers/filled-orders";
import accountShareBalances from "packages/augur-ui/src/modules/positions/reducers/account-share-balances";
import readNotifications from "packages/augur-ui/src/modules/notifications/reducers/read-notifications";
import pendingQueue from "packages/augur-ui/src/modules/pending-queue/reducers/pending-queue";

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
