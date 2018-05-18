import env from 'modules/app/reducers/env'
import blockchain from 'modules/app/reducers/blockchain'
import universe from 'modules/universe/reducers/universe'
import connection from 'modules/app/reducers/connection'
import isMobile from 'modules/app/reducers/is-mobile'
import isMobileSmall from 'modules/app/reducers/is-mobile-small'
import isAnimating from 'modules/app/reducers/is-animating'
import loginAccount from 'modules/auth/reducers/login-account'
import isLogged from 'modules/auth/reducers/is-logged'
import ledgerStatus from 'modules/auth/reducers/ledger-status'
import newMarket from 'modules/create-market/reducers/new-market'
import marketsData from 'modules/markets/reducers/markets-data'
import marketLoading from 'modules/market/reducers/market-loading'
import hasLoadedMarkets from 'modules/markets/reducers/has-loaded-markets'
import outcomesData from 'modules/markets/reducers/outcomes-data'
import favorites from 'modules/markets/reducers/favorites'
import reports from 'modules/reports/reducers/reports'
import marketsWithAccountReport from 'modules/my-reports/reducers/markets-with-account-report'
import orderBooks from 'modules/bids-asks/reducers/order-books'
import isFirstOrderBookChunkLoaded from 'modules/bids-asks/reducers/is-first-order-book-chunk-loaded'
import orderCancellation from 'modules/bids-asks/reducers/order-cancellation'
import accountTrades from 'modules/my-positions/reducers/account-trades'
import accountPositions from 'modules/my-positions/reducers/account-positions'
import transactionsData from 'modules/transactions/reducers/transactions-data'
import transactionsOldestLoadedBlock from 'modules/transactions/reducers/transactions-oldest-loaded-block'
import transactionsLoading from 'modules/transactions/reducers/transactions-loading'
import scalarMarketsShareDenomination from 'modules/market/reducers/scalar-markets-share-denomination'
import closePositionTradeGroups from 'modules/my-positions/reducers/close-position-trade-groups'
import categories from 'modules/categories/reducers/categories-data'
import hasLoadedCategory from 'modules/categories/reducers/has-loaded-category'
import selectedMarketId from 'modules/market/reducers/selected-market-id'
import tradesInProgress from 'modules/trade/reducers/trades-in-progress'
// import createMarketInProgress from 'modules/create-market/reducers/create-market-in-progress'
import priceHistory from 'modules/markets/reducers/price-history'
import marketCreatorFees from 'modules/my-markets/reducers/market-creator-fees'
import contractAddresses from 'modules/contracts/reducers/contract-addresses'
import functionsAPI from 'modules/contracts/reducers/functions-api'
import eventsAPI from 'modules/contracts/reducers/events-api'
import notifications from 'modules/notifications/reducers/notifications'
import reportingWindowStats from 'modules/reporting/reducers/reporting-window-stats'
import marketReportState from 'modules/reporting/reducers/market-report-state'
import accountDisputes from 'modules/reporting/reducers/account-disputes-state'
import modal from 'modules/modal/reducers/modal'
import participationTokens from 'modules/my-participation-tokens/reducers/participation-token-data'
import initialReporters from 'modules/my-initial-reporters/reducers/initial-reporters-data'
import disputeCrowdsourcerTokens from 'modules/my-dispute-crowdsourcer-tokens/reducers/dispute-crowdsourcer-data'
import allOrders from 'modules/escape-hatch/reducers/all-orders-data'

export function createReducer() {
  return {
    env,
    blockchain,
    universe,
    connection,
    isMobile,
    isMobileSmall,
    isAnimating,
    loginAccount,
    isLogged,
    ledgerStatus,
    newMarket,
    marketsData,
    marketLoading,
    hasLoadedMarkets,
    outcomesData,
    favorites,
    reports,
    marketsWithAccountReport,
    selectedMarketId,
    categories,
    hasLoadedCategory,
    priceHistory,
    tradesInProgress,
    orderBooks,
    isFirstOrderBookChunkLoaded,
    orderCancellation,
    accountTrades,
    accountPositions,
    transactionsData,
    transactionsOldestLoadedBlock,
    transactionsLoading,
    scalarMarketsShareDenomination,
    closePositionTradeGroups,
    marketCreatorFees,
    contractAddresses,
    functionsAPI,
    eventsAPI,
    notifications,
    reportingWindowStats,
    marketReportState,
    modal,
    participationTokens,
    initialReporters,
    disputeCrowdsourcerTokens,
    accountDisputes,
    allOrders,
  }
}
