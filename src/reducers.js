// import createMarketInProgress from 'modules/create-market/reducers/create-market-in-progress'
import accountDisputes from "modules/reports/reducers/account-disputes-state";
import accountPositions from "modules/positions/reducers/account-positions";
import accountTrades from "modules/positions/reducers/account-trades";
import blockchain from "modules/app/reducers/blockchain";
import categories from "modules/categories/reducers/categories-data";
import closePositionTradeGroups from "modules/positions/reducers/close-position-trade-groups";
import connection from "modules/app/reducers/connection";
import contractAddresses from "modules/contracts/reducers/contract-addresses";
import disputeCrowdsourcerTokens from "modules/reports/reducers/dispute-crowdsourcer-data";
import edgeContext from "modules/auth/reducers/edge-context";
import edgeLoading from "modules/auth/reducers/edge-loading";
import env from "modules/app/reducers/env";
import eventsAPI from "modules/contracts/reducers/events-api";
import favorites from "modules/markets/reducers/favorites";
import filterOption from "modules/filter-sort/reducers/filter-option";
import functionsAPI from "modules/contracts/reducers/functions-api";
import hasLoadedMarkets from "modules/markets/reducers/has-loaded-markets";
import initialReporters from "modules/reports/reducers/initial-reporters-data";
import isAnimating from "modules/app/reducers/is-animating";
import isFirstOrderBookChunkLoaded from "modules/orders/reducers/is-first-order-book-chunk-loaded";
import isLogged from "modules/auth/reducers/is-logged";
import isMobile from "modules/app/reducers/is-mobile";
import isMobileSmall from "modules/app/reducers/is-mobile-small";
import ledgerStatus from "modules/auth/reducers/ledger-status";
import loginAccount from "modules/auth/reducers/login-account";
import marketCreatorFees from "modules/markets/reducers/market-creator-fees";
import marketLoading from "modules/market/reducers/market-loading";
import marketTradingHistory from "modules/market/reducers/market-trading-history";
import marketReportState from "modules/reports/reducers/market-report-state";
import marketsData from "modules/markets/reducers/markets-data";
import marketsWithAccountReport from "modules/reports/reducers/markets-with-account-report";
import modal from "modules/modal/reducers/modal";
import newMarket from "modules/create-market/reducers/new-market";
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
import scalarMarketsShareDenomination from "modules/market/reducers/scalar-markets-share-denomination";
import selectedMarketId from "modules/market/reducers/selected-market-id";
import sortOption from "modules/filter-sort/reducers/sort-option";
import tradesInProgress from "modules/trade/reducers/trades-in-progress";
import transactionPeriod from "modules/portfolio/reducers/transaction-period";
import transactionsData from "modules/transactions/reducers/transactions-data";
import transactionsLoading from "modules/transactions/reducers/transactions-loading";
import transactionsOldestLoadedBlock from "modules/transactions/reducers/transactions-oldest-loaded-block";
import universe from "modules/universe/reducers/universe";

export function createReducer() {
  return {
    accountDisputes,
    accountPositions,
    accountTrades,
    blockchain,
    categories,
    closePositionTradeGroups,
    connection,
    contractAddresses,
    disputeCrowdsourcerTokens,
    edgeContext,
    edgeLoading,
    env,
    eventsAPI,
    favorites,
    filterOption,
    functionsAPI,
    hasLoadedMarkets,
    initialReporters,
    isAnimating,
    isFirstOrderBookChunkLoaded,
    isLogged,
    isMobile,
    isMobileSmall,
    ledgerStatus,
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
    sortOption,
    tradesInProgress,
    transactionPeriod,
    transactionsData,
    transactionsLoading,
    transactionsOldestLoadedBlock,
    universe
  };
}
