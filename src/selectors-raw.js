import activeView from 'modules/app/selectors/active-view';
import abc from 'modules/auth/selectors/abc';
import loginAccount from 'modules/account/selectors/login-account';
import links from 'modules/link/selectors/links';
import url from 'modules/link/selectors/url';
import topics from 'modules/topics/selectors/topics';
import marketsHeader from 'modules/markets/selectors/markets-header';
import marketsTotals from 'modules/markets/selectors/markets-totals';
import pagination from 'modules/markets/selectors/pagination';
import markets from 'modules/markets/selectors/markets';
import allMarkets from 'modules/markets/selectors/markets-all';
import favoriteMarkets from 'modules/markets/selectors/markets-favorite';
import filteredMarkets from 'modules/markets/selectors/markets-filtered';
import unpaginatedMarkets from 'modules/markets/selectors/markets-unpaginated';
import orderCancellation from 'modules/bids-asks/selectors/order-cancellation';
import market from 'modules/market/selectors/market';
import tags from 'modules/markets/selectors/tags';
import filterSort from 'modules/markets/selectors/filter-sort';
import portfolio from 'modules/portfolio/selectors/portfolio';
import loginAccountPositions from 'modules/my-positions/selectors/login-account-positions';
import transactions from 'modules/transactions/selectors/transactions';
import transactionsTotals from 'modules/transactions/selectors/transactions-totals';
import isTransactionsWorking from 'modules/transactions/selectors/is-transactions-working';
import tradesInProgress from 'modules/trade/selectors/trade-in-progress';
import tradeCommitLock from 'modules/trade/selectors/trade-commit-lock';
import coreStats from 'modules/account/selectors/core-stats';
import chat from 'modules/chat/selectors/chat-messages';
import { MARKET_DATA_NAV_ITEMS } from 'modules/market/constants/market-data-nav-items';
import { MARKET_USER_DATA_NAV_ITEMS } from 'modules/market/constants/market-user-data-nav-items';
import scalarShareDenomination from 'modules/market/selectors/scalar-share-denomination';
import { OUTCOME_TRADE_NAV_ITEMS } from 'modules/outcomes/constants/outcome-trade-nav-items';
import authAirbitz from 'modules/auth/selectors/auth-airbitz';
import authNavItems from 'modules/auth/selectors/auth-nav-items';
import authLogin from 'modules/auth/selectors/auth-login';
import authSignup from 'modules/auth/selectors/auth-signup';
import authImport from 'modules/auth/selectors/auth-import';
import closePositionStatus from 'modules/my-positions/selectors/close-position-status';
import openOrders from 'modules/user-open-orders/selectors/open-orders';

const selectors = {
  activeView,
  abc,
  loginAccount,
  links,
  url,
  marketsHeader,
  marketsTotals,
  pagination,
  markets,
  allMarkets,
  favoriteMarkets,
  filteredMarkets,
  unpaginatedMarkets,
  orderCancellation,
  market,
  topics,
  tags,
  filterSort,
  portfolio,
  loginAccountPositions,
  transactions,
  transactionsTotals,
  isTransactionsWorking,
  tradesInProgress,
  tradeCommitLock,
  coreStats,
  chat,
  marketDataNavItems: () => MARKET_DATA_NAV_ITEMS,
  marketUserDataNavItems: () => MARKET_USER_DATA_NAV_ITEMS,
  scalarShareDenomination,
  outcomeTradeNavItems: () => OUTCOME_TRADE_NAV_ITEMS,
  authAirbitz,
  authNavItems,
  authLogin,
  authSignup,
  authImport,
  closePositionStatus,
  openOrders
};

export default selectors;
