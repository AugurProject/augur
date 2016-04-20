import {assert} from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../../src/modules/trade/actions/trade-actions';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
// going to need better test state data.
const testState = {
  blockchain: {},
  branch: {},
  auth: { selectedAuthType: 'register', err: null },
  loginAccount: {},
  activePage: 'markets',
  marketsData: {
    test: {
      _id: 'test'
    }
  },
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
  transactions: {}
};

describe('src/modules/trade/actions/trade-actions.js', () => {
  it('should dispatch clear market', () => {
      const expectedOutput = {
        type: 'CLEAR_TRADE_IN_PROGRESS',
        marketID: 'test'
      };
      assert.deepEqual(actions.clearTradeInProgress('test'), expectedOutput);
  });

  it('should be able to handle more advanced actions...', () => {
    /*
    this is going to be an tough one because the action im attempting to call
    calls other actions that take from store which will be empty, it wont be
    using the test store i have. This is going to require some rethinking...
    */
    const store = mockStore(testState);

    // return store.dispatch(actions.placeTrade('test'))
    //   .then(() => { // return of async actions
    //     console.log(store.getActions())
    //   });

  });
});
