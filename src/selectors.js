import siteHeader from './modules/app/selectors/site-header';
import activePage from './modules/app/selectors/active-page';
import loginAccount from './modules/auth/selectors/login-account';
import links from './modules/link/selectors/links';

import authForm from './modules/auth/selectors/auth-form';

import markets from './modules/markets/selectors/markets';
import allMarkets from './modules/markets/selectors/all-markets';
import filteredMarkets from './modules/markets/selectors/filtered-markets';
import favoriteMarkets from './modules/markets/selectors/favorite-markets';
import reportMarkets from './modules/markets/selectors/report-markets';

import market from './modules/market/selectors/market';
import outcomes from './modules/market/selectors/outcomes';

import marketsHeader from './modules/markets/selectors/markets-header';
import filtersProps from './modules/markets/selectors/filters-props';
import keywordsChangeHandler from './modules/markets/selectors/keywords-change-handler';

import tradeInProgress from './modules/trade/selectors/trade-in-progress';
import tradeMarket from './modules/trade/selectors/trade-market';
import tradeOrders from './modules/trade/selectors/trade-orders';
import tradeOrdersTotals from './modules/trade/selectors/trade-orders-totals';
import placeTradeHandler from './modules/trade/selectors/place-trade-handler';

import positions from './modules/positions/selectors/positions';
import positionsSummary from './modules/positions/selectors/positions-summary';

import transactions from './modules/transactions/selectors/transactions';
import transactionsTotals from './modules/transactions/selectors/transactions-totals';
import nextTransaction from './modules/transactions/selectors/next-transaction';
import isTransactionsWorking from './modules/transactions/selectors/is-transactions-working';

import createMarketForm from './modules/create-market/selectors/create-market-form';

import report from './modules/reports/selectors/report';
import submitReportHandler from './modules/reports/selectors/submit-report-handler';

var selectors = {
	siteHeader,
	activePage,
	loginAccount,
	links,

	authForm,

	markets,
	allMarkets,
	filteredMarkets,
	favoriteMarkets,
	reportMarkets,

	market,
	outcomes,

	marketsHeader,
	filtersProps,
	keywordsChangeHandler,

	tradeInProgress,
	tradeMarket,
	tradeOrders,
	tradeOrdersTotals,
	placeTradeHandler,

	positions,
	positionsSummary,

	transactions,
	transactionsTotals,
	nextTransaction,
	isTransactionsWorking,

	createMarketForm,

	report,
	submitReportHandler
};

module.exports = {};

Object.keys(selectors).forEach(selectorKey => Object.defineProperty(module.exports, selectorKey, { get: selectors[selectorKey], enumerable: true }));




