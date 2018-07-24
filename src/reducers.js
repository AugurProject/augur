// import createMarketInProgress from 'modules/create-market/reducers/create-market-in-progress'
import accountDisputes from 'modules/reporting/reducers/account-disputes-state'
import accountPositions from 'modules/my-positions/reducers/account-positions'
import accountTrades from 'modules/my-positions/reducers/account-trades'
import blockchain from 'modules/app/reducers/blockchain'
import categories from 'modules/categories/reducers/categories-data'
import closePositionTradeGroups from 'modules/my-positions/reducers/close-position-trade-groups'
import connection from 'modules/app/reducers/connection'
import contractAddresses from 'modules/contracts/reducers/contract-addresses'
import disputeCrowdsourcerTokens from 'modules/my-dispute-crowdsourcer-tokens/reducers/dispute-crowdsourcer-data'
import edgeContext from 'modules/auth/reducers/edge-context'
import edgeLoading from 'modules/auth/reducers/edge-loading'
import env from 'modules/app/reducers/env'
import eventsAPI from 'modules/contracts/reducers/events-api'
import favorites from 'modules/markets/reducers/favorites'
import functionsAPI from 'modules/contracts/reducers/functions-api'
import hasLoadedCategory from 'modules/categories/reducers/has-loaded-category'
import hasLoadedMarkets from 'modules/markets/reducers/has-loaded-markets'
import initialReporters from 'modules/my-initial-reporters/reducers/initial-reporters-data'
import isAnimating from 'modules/app/reducers/is-animating'
import isFirstOrderBookChunkLoaded from 'modules/bids-asks/reducers/is-first-order-book-chunk-loaded'
import isLogged from 'modules/auth/reducers/is-logged'
import isMobile from 'modules/app/reducers/is-mobile'
import isMobileSmall from 'modules/app/reducers/is-mobile-small'
import ledgerStatus from 'modules/auth/reducers/ledger-status'
import loginAccount from 'modules/auth/reducers/login-account'
import marketCreatorFees from 'modules/my-markets/reducers/market-creator-fees'
import marketLoading from 'modules/market/reducers/market-loading'
import marketReportState from 'modules/reporting/reducers/market-report-state'
import marketsData from 'modules/markets/reducers/markets-data'
import marketsWithAccountReport from 'modules/my-reports/reducers/markets-with-account-report'
import modal from 'modules/modal/reducers/modal'
import newMarket from 'modules/create-market/reducers/new-market'
import notifications from 'modules/notifications/reducers/notifications'
import orderBooks from 'modules/bids-asks/reducers/order-books'
import orderCancellation from 'modules/bids-asks/reducers/order-cancellation'
import orphanedOrders from 'modules/orphaned-orders/reducers/orphaned-orders'
import outcomesData from 'modules/markets/reducers/outcomes-data'
import participationTokens from 'modules/my-participation-tokens/reducers/participation-token-data'
import priceHistory from 'modules/markets/reducers/price-history'
import reportingWindowStats from 'modules/reporting/reducers/reporting-window-stats'
import reports from 'modules/reports/reducers/reports'
import scalarMarketsShareDenomination from 'modules/market/reducers/scalar-markets-share-denomination'
import selectedMarketId from 'modules/market/reducers/selected-market-id'
import tradesInProgress from 'modules/trade/reducers/trades-in-progress'
import transactionPeriod from 'modules/portfolio/reducers/transaction-period'
import transactionsData from 'modules/transactions/reducers/transactions-data'
import transactionsLoading from 'modules/transactions/reducers/transactions-loading'
import transactionsOldestLoadedBlock from 'modules/transactions/reducers/transactions-oldest-loaded-block'
import universe from 'modules/universe/reducers/universe'

export function createReducer() {
  return {
    accountDisputes,
    accountPositions,
    accountTrades,
    allOrders,
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
    functionsAPI,
    hasLoadedCategory,
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
    priceHistory,
    reportingWindowStats,
    reports,
    scalarMarketsShareDenomination,
    selectedMarketId,
    tradesInProgress,
    transactionPeriod,
    transactionsData,
    transactionsLoading,
    transactionsOldestLoadedBlock,
    universe,
  }
}
