import {
  assert
} from 'chai';
import * as AugurJS from '../../../src/services/augurjs';
import Augur from 'augur.js';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../../../src/modules/trade/actions/update-trades-in-progress';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
// going to need better test state data.
const testState = {
  blockchain: {},
  branch: {},
  auth: {
    selectedAuthType: 'register',
    err: null
  },
  loginAccount: {},
  activePage: 'markets',
  marketsData: {
    test: {
      _id: 'test',
      outcomeID: {
        test: '123'
      }
    }
  },
  favorites: {},
  pendingReports: {},
  selectedMarketID: null,
  selectedMarketsHeader: null,
  keywords: '',
  selectedFilters: {
    isOpen: true
  },
  selectedSort: {
    prop: 'volume',
    isDesc: true
  },
  tradesInProgress: {},
  createMarketInProgress: {},
  outcomes: {},
  bidsAsks: {},
  accountTrades: {},
  transactions: {}
};

const store = mockStore(testState);

describe('src/modules/trade/actions/trade-actions.js', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Augur, "getMarketInfo", (marketID, callback) => {
      return {
        _id: marketID,
        outcomeID: { test: '123' }
      };
    });
    sandbox.stub(Augur, "lsLmsr", (market, callback) => {
      return  350;
    });
    sandbox.stub(Augur, "getSimulatedBuy", (market, outcome, amount, callback) => {});
    sandbox.stub(AugurJS, "getSimulatedBuy", (marketID, outcomeID, numShares) => {
      return { '0': 3.50, '1': .5 };
    });
    sandbox.stub(AugurJS, "getSimulatedSell", (marketID, outcomeID, numShares) => {
      [3.50, .5]
    });
  });

  afterEach(() => {
    // restore the environment as it was before
    sandbox.restore();
  });

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
    Also AugurJS is called sometimes and we will need to use a dummy version or possible post test markets with extremely long lifetimes that can be used to test some of our actions...but i don't think that's a great idea overall.
    */

    return store.dispatch(actions.updateTradesInProgress('test', 'outcomeID', 3, 1))
      .then(() => { // return of async actions
        console.log(store.getActions())
      });

  });
});
