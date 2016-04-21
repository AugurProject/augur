import { assert } from 'chai';
import store from '../src/store';

// expectedInitialState = {
//   blockchain: {},
//   branch: {},
//   auth: { selectedAuthType: 'register', err: null },
//   loginAccount: {},
//   activePage: 'markets',
//   marketsData: {},
//   favorites: {},
//   pendingReports: {},
//   selectedMarketID: null,
//   selectedMarketsHeader: null,
//   keywords: '',
//   selectedFilters: { isOpen: true },
//   selectedSort: { prop: 'volume', isDesc: true },
//   tradesInProgress: {},
//   createMarketInProgress: {},
//   outcomes: {},
//   bidsAsks: {},
//   accountTrades: {},
//   transactions: {}
// }


const state = store.getState();

describe('src/store.js', () => {

  it('should initialize with the correct default state', () => {
    assert.isOk(state, 'state is defined');
    assert.isObject(state, 'state is an object');

    assert.isOk(state.blockchain, 'blockchain is defined');
    assert.isObject(state.blockchain, 'blockchain is an object');
    assert.deepEqual(state.blockchain, {}, 'blockchain is an empty object');

    assert.isOk(state.branch, 'branch is defined');
    assert.isObject(state.branch, 'branch is an object');
    assert.deepEqual(state.branch, {}, 'branch is an empty object');

    assert.isOk(state.auth, 'auth is defined');
    assert.isObject(state.auth, 'auth is an object');
    assert.deepPropertyVal(state, 'auth.selectedAuthType', 'register', 'auth.selectedAuthType is "register"');
    assert.deepPropertyVal(state, 'auth.err', null, 'auth.err is null');

    assert.isOk(state.loginAccount, 'loginAccount is defined');
    assert.isObject(state.loginAccount, 'loginAccount is an object');
    assert.deepEqual(state.loginAccount, {}, 'loginAccount is an empty object');

    assert.isOk(state.activePage, 'activePage is defined');
    assert.isString(state.activePage, 'activePage is a string');
    assert.deepEqual(state.activePage, 'markets', 'activePage is "markets"');

    assert.isOk(state.marketsData, 'marketsData is defined');
    assert.isObject(state.marketsData, 'marketsData is an object');
    assert.deepEqual(state.marketsData, {}, 'marketsData is an empty object');

    assert.isOk(state.favorites, 'favorites is defined');
    assert.isObject(state.favorites, 'favorites is an object');
    assert.deepEqual(state.favorites, {}, 'favorites is an empty object');

    assert.isOk(state.reports, 'reports is defined');
    assert.isObject(state.reports, 'reports is an object');
    assert.deepEqual(state.reports, {}, 'reports is an empty object');

    assert.isNotOk(store.selectedMarketID, 'selectedMarketID is null');
    assert.isNotOk(store.selectedMarketsHeader, 'selectedMarketsHeader is null');

    assert.isString(state.keywords, 'keywords is a string');
    assert.deepEqual(state.keywords, '', 'keywords is ""');

    assert.isOk(state.selectedFilters, 'selectedFilters is defined');
    assert.isObject(state.selectedFilters, 'selectedFilters is an object');
    assert.isOk(state.selectedFilters.isOpen, 'selectedFilters.isOpen is true');

    assert.isOk(state.selectedSort, 'selectedSort is defined');
    assert.isObject(state.selectedSort, 'selectedSort is an Object');
    assert.isOk(state.selectedSort.isDesc, 'selectedSort.isDesc is true');
    assert.deepPropertyVal(state, 'selectedSort.prop', 'volume', 'selectedSort.prop equals volume');

    assert.isOk(state.tradesInProgress, 'tradesInProgress is defined');
    assert.isObject(state.tradesInProgress, 'tradesInProgress is an object');
    assert.deepEqual(state.tradesInProgress, {}, 'tradesInProgress is an empty object');

    assert.isOk(state.createMarketInProgress, 'createMarketInProgress is defined');
    assert.isObject(state.createMarketInProgress, 'createMarketInProgress is an object');
    assert.deepEqual(state.createMarketInProgress, {}, 'createMarketInProgress is an empty object');

    assert.isOk(state.outcomes, 'outcomes is defined');
    assert.isObject(state.outcomes, 'outcomes is an object');
    assert.deepEqual(state.outcomes, {}, 'outcomes is an empty object');

    assert.isOk(state.bidsAsks, 'bidsAsks is defined');
    assert.isObject(state.bidsAsks, 'bidsAsks is an object');
    assert.deepEqual(state.bidsAsks, {}, 'bidsAsks is an empty object');

    assert.isOk(state.accountTrades, 'accountTrades is defined');
    assert.isObject(state.accountTrades, 'accountTrades is an object');
    assert.deepEqual(state.accountTrades, {}, 'accountTrades is an empty object');

    assert.isOk(state.transactions, 'transactions is defined');
    assert.isObject(state.transactions, 'transactions is an object');
    assert.deepEqual(state.transactions, {}, 'transactions is an empty object');
  });
});
