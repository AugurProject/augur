

import store from 'src/store'
/*
==================================
|      expectedInitialState      |
==================================

{
  blockchain: {},
  universe: {},
  auth: { selectedAuthType: 'register', err: null },
  loginAccount: {},
  activePage: 'categorys',
  marketsData: {},
  favorites: {},
  pendingReports: {},
  selectedMarketId: null,
  selectedMarketsHeader: null,
  tags: '',
  selectedFilters: { isOpen: true },
  selectedSort: { prop: 'volume', isDesc: true },
  tradesInProgress: {},
  outcomes: {},
  bidsAsks: {},
  accountTrades: {},
  transactionsData: {}
}
*/
describe(`store.js`, () => {
  const state = store.getState()

  it('should initialize with the correct default state', () => {
    assert.isOk(state, 'state is not defined')
    assert.isObject(state, 'state is not a object')

    assert.isOk(state.blockchain, 'blockchain is not defined')
    assert.isObject(state.blockchain, 'blockchain is not an object')
    assert.deepEqual(state.blockchain, {}, 'blockchain is not an empty object')

    assert.isOk(state.universe, 'universe is not defined')
    assert.isObject(state.universe, 'universe is not an object')
    assert.deepEqual(state.universe, {}, 'universe is not an empty object')

    assert.isOk(state.loginAccount, 'loginAccount is not defined')
    assert.isObject(state.loginAccount, 'loginAccount is not an object')
    assert.deepEqual(state.loginAccount, {}, 'loginAccount is not an empty object')

    assert.isOk(state.marketsData, 'marketsData is not defined')
    assert.isObject(state.marketsData, 'marketsData is not an object')
    assert.deepEqual(state.marketsData, {}, 'marketsData is not an empty object')

    assert.isOk(state.favorites, 'favorites is not defined')
    assert.isObject(state.favorites, 'favorites is not an object')
    assert.deepEqual(state.favorites, {}, 'favorites is not an empty object')

    assert.isOk(state.reports, 'reports is not defined')
    assert.isObject(state.reports, 'reports is not an object')
    assert.deepEqual(state.reports, {}, 'reports is not an empty object')

    assert.isOk(state.tradesInProgress, 'tradesInProgress is not defined')
    assert.isObject(state.tradesInProgress, 'tradesInProgress is not an object')
    assert.deepEqual(state.tradesInProgress, {}, 'tradesInProgress is not an empty object')

    assert.isOk(state.outcomesData, 'outcomes is not defined')
    assert.isObject(state.outcomesData, 'outcomes is not an object')
    assert.deepEqual(state.outcomesData, {}, 'outcomes is not an empty object')

    assert.isOk(state.orderBooks, 'orderBooks is not defined')
    assert.isObject(state.orderBooks, 'orderBooks is not an object')
    assert.deepEqual(state.orderBooks, {}, 'orderBooks is not an empty object')

    assert.deepEqual(state.accountTrades, {}, 'accountTrades is an empty object')

    assert.isOk(state.transactionsData, 'transactionsData is not defined')
    assert.isObject(state.transactionsData, 'transactionsData is not an object')
    assert.deepEqual(state.transactionsData, {}, 'transactionsData is not an empty object')
  })
})
