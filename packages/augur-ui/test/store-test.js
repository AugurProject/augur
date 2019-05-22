import store from "src/store";
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
  tags: '',
  selectedFilters: { isOpen: true },
  selectedSort: { prop: 'volume', isDesc: true },
  outcomes: {},
  bidsAsks: {},
  accountTrades: {},
  transactionsData: {}
}
*/
describe(`store.js`, () => {
  const state = store.getState();

  it("should initialize with the correct default state", () => {
    assert.isOk(state, "state is not defined");
    assert.isObject(state, "state is not a object");

    assert.isOk(state.blockchain, "blockchain is not defined");
    assert.isObject(state.blockchain, "blockchain is not an object");
    assert.deepEqual(state.blockchain, {}, "blockchain is not an empty object");

    assert.isOk(state.universe, "universe is not defined");
    assert.isObject(state.universe, "universe is not an object");
    assert.deepEqual(state.universe, {}, "universe is not an empty object");

    assert.isOk(state.loginAccount, "loginAccount is not defined");
    assert.isObject(state.loginAccount, "loginAccount is not an object");
    assert.deepEqual(
      state.loginAccount,
      {},
      "loginAccount is not an empty object"
    );

    assert.isOk(state.marketsData, "marketsData is not defined");
    assert.isObject(state.marketsData, "marketsData is not an object");
    assert.deepEqual(
      state.marketsData,
      {},
      "marketsData is not an empty object"
    );

    assert.isOk(state.favorites, "favorites is not defined");
    assert.isObject(state.favorites, "favorites is not an object");
    assert.deepEqual(state.favorites, {}, "favorites is not an empty object");

    assert.isOk(state.alerts, "alerts is not defined");
    assert.isArray(state.alerts, "alerts is not an array");
    assert.deepEqual(
      state.alerts,
      [],
      "alerts is not an empty array"
    );

    assert.isOk(state.outcomesData, "outcomes is not defined");
    assert.isObject(state.outcomesData, "outcomes is not an object");
    assert.deepEqual(state.outcomesData, {}, "outcomes is not an empty object");

    assert.isOk(state.orderBooks, "orderBooks is not defined");
    assert.isObject(state.orderBooks, "orderBooks is not an object");
    assert.deepEqual(state.orderBooks, {}, "orderBooks is not an empty object");

    assert.deepEqual(
      state.accountTrades,
      {},
      "accountTrades is an empty object"
    );

    assert.isOk(state.transactionsData, "transactionsData is not defined");
    assert.isObject(
      state.transactionsData,
      "transactionsData is not an object"
    );
    assert.deepEqual(
      state.transactionsData,
      {},
      "transactionsData is not an empty object"
    );
  });
});
