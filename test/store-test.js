import {
	assert
} from 'chai';
import store from '../src/store';
/*
==================================
|      expectedInitialState      |
==================================

{
  blockchain: {},
  branch: {},
  auth: { selectedAuthType: 'register', err: null },
  loginAccount: {},
  activePage: 'markets',
  marketsData: {},
  favorites: {},
  pendingReports: {},
  selectedMarketID: null,
  selectedMarketsHeader: null,
  keywords: '',
  selectedFilters: { isOpen: true },
  selectedSort: { prop: 'volume', isDesc: true },
  tradesInProgress: {},
  createMarketInProgress: {},
  outcomes: {},
  bidsAsks: {},
  accountTrades: {},
  transactionsData: {}
}
*/
describe(`store.js`, () => {
	const state = store.getState();

	it('should initialize with the correct default state', () => {
		assert.isOk(state, 'state is not defined');
		assert.isObject(state, 'state is not a object');

		assert.isOk(state.blockchain, 'blockchain is not defined');
		assert.isObject(state.blockchain, 'blockchain is not an object');
		assert.deepEqual(state.blockchain, {}, 'blockchain is not an empty object');

		assert.isOk(state.branch, 'branch is not defined');
		assert.isObject(state.branch, 'branch is not an object');
		assert.deepEqual(state.branch, {}, 'branch is not an empty object');

		assert.isOk(state.auth, 'auth is not defined');
		assert.isObject(state.auth, 'auth is not an object');
		assert.deepPropertyVal(state, 'auth.selectedAuthType', 'register', 'auth.selectedAuthType is not "register"');
		assert.deepPropertyVal(state, 'auth.err', null, 'auth.err is not null');

		assert.isOk(state.loginAccount, 'loginAccount is not defined');
		assert.isObject(state.loginAccount, 'loginAccount is not an object');
		assert.deepEqual(state.loginAccount, {}, 'loginAccount is not an empty object');

		assert.isOk(state.activePage, 'activePage is not defined');
		assert.isString(state.activePage, 'activePage is not a string');
		assert.deepEqual(state.activePage, 'markets', 'activePage is not "markets"');

		assert.isOk(state.marketsData, 'marketsData is not defined');
		assert.isObject(state.marketsData, 'marketsData is not an object');
		assert.deepEqual(state.marketsData, {}, 'marketsData is not an empty object');

		assert.isOk(state.favorites, 'favorites is not defined');
		assert.isObject(state.favorites, 'favorites is not an object');
		assert.deepEqual(state.favorites, {}, 'favorites is not an empty object');

		assert.isOk(state.reports, 'reports is not defined');
		assert.isObject(state.reports, 'reports is not an object');
		assert.deepEqual(state.reports, {}, 'reports is not an empty object');

		assert.isNotOk(store.selectedMarketID, 'selectedMarketID is not null');
		assert.isNotOk(store.selectedMarketsHeader, 'selectedMarketsHeader is not null');

		assert.isString(state.keywords, 'keywords is not a string');
		assert.deepEqual(state.keywords, '', 'keywords is not ""');

		assert.isOk(state.selectedFilters, 'selectedFilters is not defined');
		assert.isObject(state.selectedFilters, 'selectedFilters is not an object');
		assert.isOk(state.selectedFilters.isOpen, 'selectedFilters.isOpen is not true');

		assert.isOk(state.selectedSort, 'selectedSort is not defined');
		assert.isObject(state.selectedSort, 'selectedSort is not an Object');
		assert.isOk(state.selectedSort.isDesc, 'selectedSort.isDesc is not true');
		assert.deepPropertyVal(state, 'selectedSort.prop', 'volume', 'selectedSort.prop equals volume');

		assert.isOk(state.tradesInProgress, 'tradesInProgress is not defined');
		assert.isObject(state.tradesInProgress, 'tradesInProgress is not an object');
		assert.deepEqual(state.tradesInProgress, {}, 'tradesInProgress is not an empty object');

		assert.isOk(state.createMarketInProgress, 'createMarketInProgress is not defined');
		assert.isObject(state.createMarketInProgress, 'createMarketInProgress is not an object');
		assert.deepEqual(state.createMarketInProgress, {}, 'createMarketInProgress is not an empty object');

		assert.isOk(state.outcomes, 'outcomes is not defined');
		assert.isObject(state.outcomes, 'outcomes is not an object');
		assert.deepEqual(state.outcomes, {}, 'outcomes is not an empty object');

		assert.isOk(state.marketOrderBooks, 'marketOrderBooks is not defined');
		assert.isObject(state.marketOrderBooks, 'marketOrderBooks is not an object');
		assert.deepEqual(state.marketOrderBooks, {}, 'marketOrderBooks is not an empty object');

		assert.isOk(state.accountTrades, 'accountTrades is not defined');
		assert.isObject(state.accountTrades, 'accountTrades is not an object');
		assert.deepEqual(state.accountTrades, {}, 'accountTrades is not an empty object');

		assert.isOk(state.transactionsData, 'transactionsData is not defined');
		assert.isObject(state.transactionsData, 'transactionsData is not an object');
		assert.deepEqual(state.transactionsData, {}, 'transactionsData is not an empty object');
	});
});
