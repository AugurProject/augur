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

});
