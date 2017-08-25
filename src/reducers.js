import env from 'modules/app/reducers/env';
import blockchain from 'modules/app/reducers/blockchain';
import branch from 'modules/branch/reducers/branch';
import connection from 'modules/app/reducers/connection';

import isMobile from 'modules/app/reducers/is-mobile';
import headerHeight from 'modules/app/reducers/header-height';
import footerHeight from 'modules/app/reducers/footer-height';

import loginAccount from 'modules/auth/reducers/login-account';
import isLoggedIn from 'modules/auth/reducers/is-logged-in';
import accountName from 'modules/account/reducers/account-name';

import newMarket from 'modules/create-market/reducers/new-market';

import marketsData from 'modules/markets/reducers/markets-data';
import marketLoading from 'modules/market/reducers/market-loading';
import hasLoadedMarkets from 'modules/markets/reducers/has-loaded-markets';
import outcomesData from 'modules/markets/reducers/outcomes-data';
import eventMarketsMap from 'modules/markets/reducers/event-markets-map';
import favorites from 'modules/markets/reducers/favorites';
import marketsFilteredSorted from 'modules/markets/reducers/markets-filtered-sorted';

import reports from 'modules/reports/reducers/reports';
import eventsWithAccountReport from 'modules/my-reports/reducers/events-with-account-report';

import orderBooks from 'modules/bids-asks/reducers/order-books';
import isFirstOrderBookChunkLoaded from 'modules/bids-asks/reducers/is-first-order-book-chunk-loaded';
import orderCancellation from 'modules/bids-asks/reducers/order-cancellation';
import accountTrades from 'modules/my-positions/reducers/account-trades';
import accountPositions from 'modules/my-positions/reducers/account-positions';
import completeSetsBought from 'modules/my-positions/reducers/complete-sets-bought';
import netEffectiveTrades from 'modules/my-positions/reducers/net-effective-trades';
import transactionsData from 'modules/transactions/reducers/transactions-data';
import transactionsOldestLoadedBlock from 'modules/transactions/reducers/transactions-oldest-loaded-block';
import transactionsLoading from 'modules/transactions/reducers/transactions-loading';
import scalarMarketsShareDenomination from 'modules/market/reducers/scalar-markets-share-denomination';
import closePositionTradeGroups from 'modules/my-positions/reducers/close-position-trade-groups';

import topics from 'modules/topics/reducers/topics-data';
import hasLoadedTopic from 'modules/topics/reducers/has-loaded-topic';

import selectedMarketID from 'modules/market/reducers/selected-market-id';
import tradesInProgress from 'modules/trade/reducers/trades-in-progress';
// import createMarketInProgress from 'modules/create-market/reducers/create-market-in-progress';
import priceHistory from 'modules/markets/reducers/price-history';

import chatMessages from 'modules/chat/reducers/chat-messages';

import marketCreatorFees from 'modules/my-markets/reducers/market-creator-fees';

import contractAddresses from 'modules/contracts/reducers/contract-addresses';
import functionsAPI from 'modules/contracts/reducers/functions-api';
import eventsAPI from 'modules/contracts/reducers/events-api';
import notifications from 'modules/notifications/reducers/notifications';

export function createReducer() {
  return {
    env,
    blockchain,
    branch,
    connection,

    isMobile,
    headerHeight,
    footerHeight,

    loginAccount,
    isLoggedIn,
    accountName,

    newMarket,

    marketsData,
    marketLoading,
    hasLoadedMarkets,
    outcomesData,
    eventMarketsMap,
    favorites,
    marketsFilteredSorted,

    reports,
    eventsWithAccountReport,

    selectedMarketID,
    topics,
    hasLoadedTopic,
    priceHistory,

    tradesInProgress,

    orderBooks,
    isFirstOrderBookChunkLoaded,
    orderCancellation,
    accountTrades,
    accountPositions,
    completeSetsBought,
    netEffectiveTrades,
    transactionsData,
    transactionsOldestLoadedBlock,
    transactionsLoading,
    scalarMarketsShareDenomination,
    closePositionTradeGroups,

    chatMessages,

    marketCreatorFees,

    contractAddresses,
    functionsAPI,
    eventsAPI,
    notifications
  };
}
