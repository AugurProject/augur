import activeView from './modules/app/selectors/active-view';
import abc from './modules/auth/selectors/abc';
import loginAccount from './modules/auth/selectors/login-account';
import links from './modules/link/selectors/links';
import url from './modules/link/selectors/url';
import authForm from './modules/auth/selectors/auth-form';
import marketsHeader from './modules/markets/selectors/markets-header';
import marketsTotals from './modules/markets/selectors/markets-totals';
import pagination from './modules/markets/selectors/pagination';
import marketDataUpdater from './modules/markets/selectors/market-data-updater';
import marketDataAge from './modules/market/selectors/market-data-age';
import markets from './modules/markets/selectors/markets';
import allMarkets from './modules/markets/selectors/markets-all';
import favoriteMarkets from './modules/markets/selectors/markets-favorite';
import filteredMarkets from './modules/markets/selectors/markets-filtered';
import unpaginatedMarkets from './modules/markets/selectors/markets-unpaginated';
import orderCancellation from './modules/bids-asks/selectors/order-cancellation';
import market from './modules/market/selectors/market';
import selectedOutcome from './modules/outcome/selectors/selected-outcome';
import tags from './modules/markets/selectors/tags';
import filterSort from './modules/markets/selectors/filter-sort';
import keywords from './modules/markets/selectors/keywords';
import portfolio from './modules/portfolio/selectors/portfolio';
import loginAccountPositions from './modules/my-positions/selectors/login-account-positions';
import loginAccountMarkets from './modules/my-markets/selectors/login-account-markets';
import transactions from './modules/transactions/selectors/transactions';
import transactionsTotals from './modules/transactions/selectors/transactions-totals';
import isTransactionsWorking from './modules/transactions/selectors/is-transactions-working';
import tradesInProgress from './modules/trade/selectors/trade-in-progress';
import tradeCommitLock from './modules/trade/selectors/trade-commit-lock';
import createMarketForm from './modules/create-market/selectors/create-market-form';
import coreStats from './modules/auth/selectors/core-stats';
import settings from './modules/auth/selectors/account-settings';
import chat from './modules/chat/selectors/chat-messages';
import branch from './modules/app/selectors/branch';
import marketDataNavItems from 'modules/market/selectors/market-data-nav-items';
import marketUserDataNavItems from 'modules/market/selectors/market-user-data-nav-items';
import scalarShareDenomination from './modules/market/selectors/scalar-share-denomination';

const selectors = {
	activeView,
	abc,
	loginAccount,
	links,
	url,
	authForm,
	createMarketForm,
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
	selectedOutcome,
	marketDataUpdater,
	marketDataAge,
	tags,
	filterSort,
	keywords,
	portfolio,
	loginAccountPositions,
	loginAccountMarkets,
	transactions,
	transactionsTotals,
	isTransactionsWorking,
	tradesInProgress,
	tradeCommitLock,
	coreStats,
	settings,
	chat,
	branch,
	marketDataNavItems,
	marketUserDataNavItems,
	scalarShareDenomination
};

module.exports = {};

Object.keys(selectors).forEach(selectorKey =>
 Object.defineProperty(module.exports,
		selectorKey,
		{ get: selectors[selectorKey], enumerable: true }
));
