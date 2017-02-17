import { combineReducers } from 'redux';

import env from 'modules/app/reducers/env';
import requests from 'modules/app/reducers/requests';
import blockchain from 'modules/app/reducers/blockchain';
import branch from 'modules/branch/reducers/branch';
import connection from 'modules/app/reducers/connection';
import url from 'modules/link/reducers/url';

import auth from 'modules/auth/reducers/auth';
import loginAccount from 'modules/auth/reducers/login-account';
import activeView from 'modules/app/reducers/active-view';

import marketsData from 'modules/markets/reducers/markets-data';
import hasLoadedMarkets from 'modules/markets/reducers/has-loaded-markets';
import outcomesData from 'modules/markets/reducers/outcomes-data';
import eventMarketsMap from 'modules/markets/reducers/event-markets-map';
import favorites from 'modules/markets/reducers/favorites';
import pagination from 'modules/markets/reducers/pagination';

import reports from 'modules/reports/reducers/reports';
import oldestLoadedEventPeriod from 'modules/my-reports/reducers/oldest-loaded-event-period';
import eventsWithAccountReport from 'modules/my-reports/reducers/events-with-account-report';

import orderBooks from 'modules/bids-asks/reducers/order-books';
import orderCancellation from 'modules/bids-asks/reducers/order-cancellation';
import marketTrades from 'modules/portfolio/reducers/market-trades';
import accountTrades from 'modules/my-positions/reducers/account-trades';
import accountPositions from 'modules/my-positions/reducers/account-positions';
import completeSetsBought from 'modules/my-positions/reducers/complete-sets-bought';
import netEffectiveTrades from 'modules/my-positions/reducers/net-effective-trades';
import transactionsData from 'modules/transactions/reducers/transactions-data';
import scalarMarketsShareDenomination from 'modules/market/reducers/scalar-markets-share-denomination';
import closePositionTradeGroups from 'modules/my-positions/reducers/close-position-trade-groups';

import topics from 'modules/topics/reducers/topics-data';
import hasLoadedTopic from 'modules/topics/reducers/has-loaded-topic';
import selectedTopic from 'modules/topics/reducers/selected-topic';

import selectedMarketID from 'modules/markets/reducers/selected-market-id';
import selectedMarketsHeader from 'modules/markets/reducers/selected-markets-header';
import selectedMarketsSubset from 'modules/markets/reducers/selectedMarketsSubset';
import tradesInProgress from 'modules/trade/reducers/trades-in-progress';
import tradeCommitLock from 'modules/trade/reducers/trade-commit-lock';
import reportCommitLock from 'modules/reports/reducers/report-commit-lock';
import tradeCommitment from 'modules/trade/reducers/trade-commitment';
import sellCompleteSetsLock from 'modules/my-positions/reducers/sell-complete-sets-lock';
import smallestPositions from 'modules/my-positions/reducers/smallest-positions';
import createMarketInProgress from 'modules/create-market/reducers/create-market-in-progress';
import keywords from 'modules/markets/reducers/keywords';
import selectedTags from 'modules/markets/reducers/selected-tags';
import selectedFilterSort from 'modules/markets/reducers/selected-filter-sort';
import priceHistory from 'modules/markets/reducers/price-history';

import chatMessages from 'modules/chat/reducers/chat-messages';

import loginMessage from 'modules/login-message/reducers/login-message';

import marketCreatorFees from 'modules/my-markets/reducers/market-creator-fees';

export function createReducer() {
  return combineReducers({
    env,
    requests,
    blockchain,
    branch,
    connection,
    url,

    auth,
    loginAccount,
    activeView,

    marketsData,
    hasLoadedMarkets,
    outcomesData,
    eventMarketsMap,
    favorites,
    pagination,

    reports,
    oldestLoadedEventPeriod,
    eventsWithAccountReport,

    selectedMarketID,
    selectedMarketsSubset,
    selectedMarketsHeader,
    keywords,
    topics,
    hasLoadedTopic,
    selectedTopic,
    selectedTags,
    selectedFilterSort,
    priceHistory,
    loginMessage,

    tradesInProgress,
    tradeCommitLock,
    reportCommitLock,
    tradeCommitment,
    sellCompleteSetsLock,
    smallestPositions,
    createMarketInProgress,

    orderBooks,
    orderCancellation,
    marketTrades,
    accountTrades,
    accountPositions,
    completeSetsBought,
    netEffectiveTrades,
    transactionsData,
    scalarMarketsShareDenomination,
    closePositionTradeGroups,

    chatMessages,

    marketCreatorFees
  });
}
