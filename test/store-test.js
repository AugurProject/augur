import { describe, it } from 'mocha';
import { assert } from 'chai';
import store from 'src/store';
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

		assert.isOk(state.activeView, 'activeView is not defined');
		assert.isString(state.activeView, 'activeView is not a string');
		assert.deepEqual(state.activeView, 'markets', 'activeView is not "markets"');

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

		assert.isOk(state.selectedFilterSort, 'selectedSort is not defined');
		assert.isObject(state.selectedFilterSort, 'selectedSort is not an Object');
		assert.isOk(state.selectedFilterSort.isDesc, 'selectedSort.isDesc is not true');
		assert.deepPropertyVal(state, 'selectedFilterSort.type', 'open', `selectedFilterSort.type doesn't equal 'open'`);
		assert.deepPropertyVal(state, 'selectedFilterSort.sort', 'volume', `sectectedFilterSort.sort doesn't equal 'volume'`);
		assert.deepPropertyVal(state, 'selectedFilterSort.isDesc', true, `selectedFilterSort.isDesc doesn't equal 'true'`);

		assert.isOk(state.tradesInProgress, 'tradesInProgress is not defined');
		assert.isObject(state.tradesInProgress, 'tradesInProgress is not an object');
		assert.deepEqual(state.tradesInProgress, {}, 'tradesInProgress is not an empty object');

		assert.isOk(state.createMarketInProgress, 'createMarketInProgress is not defined');
		assert.isObject(state.createMarketInProgress, 'createMarketInProgress is not an object');
		assert.deepEqual(state.createMarketInProgress, {}, 'createMarketInProgress is not an empty object');

		assert.isOk(state.outcomesData, 'outcomes is not defined');
		assert.isObject(state.outcomesData, 'outcomes is not an object');
		assert.deepEqual(state.outcomesData, {}, 'outcomes is not an empty object');

		assert.isOk(state.orderBooks, 'orderBooks is not defined');
		assert.isObject(state.orderBooks, 'orderBooks is not an object');
		assert.deepEqual(state.orderBooks, {}, 'orderBooks is not an empty object');

		assert.deepEqual(state.accountTrades, null, 'accountTrades is an empty object');

		assert.isOk(state.transactionsData, 'transactionsData is not defined');
		assert.isObject(state.transactionsData, 'transactionsData is not an object');
		assert.deepEqual(state.transactionsData, {}, 'transactionsData is not an empty object');
	});
});
