import activePage from './modules/app/selectors/active-page';
import loginAccount from './modules/auth/selectors/login-account';
import links from './modules/link/selectors/links';

import authForm from './modules/auth/selectors/auth-form';

import marketsHeader from './modules/markets/selectors/markets-header';
import markets from './modules/markets/selectors/markets';
import allMarkets from './modules/markets/selectors/all-markets';
import marketsTotals from './modules/markets/selectors/markets-totals';
import pagination from './modules/markets/selectors/pagination';

import market from './modules/market/selectors/market';

import filtersProps from './modules/markets/selectors/filters-props';
import searchSort from './modules/markets/selectors/search-sort';
import keywords from './modules/markets/selectors/keywords';

import transactions from './modules/transactions/selectors/transactions';
import transactionsTotals from './modules/transactions/selectors/transactions-totals';
import isTransactionsWorking from './modules/transactions/selectors/is-transactions-working';

import createMarketForm from './modules/create-market/selectors/create-market-form';

var selectors = {
	activePage,
	loginAccount,
	links,

	authForm,
	createMarketForm,

	marketsHeader,
	markets,
	allMarkets,
	marketsTotals,
	pagination,

	market,

	filtersProps,
	searchSort,
	keywords,

	transactions,
	transactionsTotals,
	isTransactionsWorking
};

module.exports = {};

Object.keys(selectors).forEach(selectorKey => Object.defineProperty(module.exports, selectorKey, { get: selectors[selectorKey], enumerable: true }));




