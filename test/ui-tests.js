import {assert} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from './testState';

import activePage from './app/selectors/active-page-test';
import loginAccount from './auth/selectors/login-account-test';
import links from './link/selectors/links-test';
import authForm from './auth/selectors/auth-form-test';
import marketsHeader from './markets/selectors/markets-header-test';
import markets from './markets/selectors/markets-test';
import allMarkets from './markets/selectors/all-markets-test';
import favoriteMarkets from './markets/selectors/markets-favorite-test';
import filteredMarkets from './markets/selectors/markets-filtered-test';
import unpaginatedMarkets from './markets/selectors/markets-unpaginated-test';
import marketsTotals from './markets/selectors/markets-totals-test';
import pagination from './markets/selectors/pagination-test';
import market from './market/selectors/market-test';
import filters from './markets/selectors/filters-test';
import searchSort from './markets/selectors/search-sort-test';
import keywords from './markets/selectors/keywords-test';
import transactions from './transactions/selectors/transactions-test';
import transactionsTotals from './transactions/selectors/transactions-totals-test';
import createMarketForm from './create-market/selectors/create-market-form-test';

let selectors;
// describe('ui tests', () => {
	proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;
  let state = Object.assign({}, testState);
  store = mockStore(state);

	selectors = proxyquire('../src/selectors.js', {
		'./modules/app/selectors/active-page': activePage,
		'./modules/auth/selectors/login-account': loginAccount,
		'./modules/link/selectors/links': links,
		'./modules/auth/selectors/auth-form': authForm,
		'./modules/markets/selectors/markets-header': marketsHeader,
		'./modules/markets/selectors/markets': markets,
		'./modules/markets/selectors/markets-all': allMarkets,
		'./modules/markets/selectors/markets-favorite': favoriteMarkets,
		'./modules/markets/selectors/markets-filtered': filteredMarkets,
		'./modules/markets/selectors/markets-unpaginated': unpaginatedMarkets,
		'./modules/markets/selectors/markets-totals': marketsTotals,
		'./modules/markets/selectors/pagination': pagination,
		'./modules/market/selectors/market': market,
		'./modules/markets/selectors/filters': filters,
		'./modules/markets/selectors/search-sort': searchSort,
		'./modules/markets/selectors/keywords': keywords,
		'./modules/transactions/selectors/transactions': transactions,
		'./modules/transactions/selectors/transactions-totals': transactionsTotals,
		'./modules/create-market/selectors/create-market-form': createMarketForm
	});

	// it(`should do some stuff`, () => {
	// 	console.log(selectors.activePage);
	// 	console.log(selectors.loginAccount);
	// 	console.log(selectors.links);
	// 	console.log(selectors.authForm);
	// 	console.log(selectors.marketsHeader);
	// 	console.log(selectors.markets);
	// 	console.log(selectors.allMarkets);
	// 	console.log(selectors.favoriteMarkets);
	// 	console.log(selectors.filteredMarkets);
	// 	console.log(selectors.unpaginatedMarkets);
	// 	console.log(selectors.marketsTotals);
	// 	console.log(selectors.pagination);
	// 	console.log(selectors.market);
	// 	console.log(selectors.filters);
	// 	console.log(selectors.searchSort);
	// 	console.log(selectors.keywords);
	// 	console.log(selectors.transactions);
	// 	console.log(selectors.transactionsTotals);
	// 	// isTransactionsWorking is a boolean so we don't need to bring in the test
	// 	// version
	// 	console.log(selectors.isTransactionsWorking);
	// 	console.log(selectors.createMarketForm);
	// });
// });

export default selectors;
