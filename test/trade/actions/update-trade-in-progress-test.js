import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
// import * as AugurJS from '../../../src/services/augurjs';
// import Augur from 'augur.js';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
// import * as actions from '../../../src/modules/trade/actions/update-trades-in-progress';

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
      outcomeID: 'outcomeID',
      details: {
        numShares: 1000,
        limitPrice: 50,
        totalCost: 3.50,
        newPrice: .5,
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
const fakeAugurJS = {};


describe('src/modules/trade/actions/trade-actions.js', () => {
  let sandbox;
  let actions;
  console.log(new Date());

  beforeEach(() => {
    // this works but only if we do before each... not sure why yet.
    // This is all getting called correctly but trades in progress still fails.
    actions = proxyquire('../../../src/modules/trade/actions/update-trades-in-progress', {
      '../../../services/augurjs': fakeAugurJS
    });

    fakeAugurJS.getSimulatedBuy = (market, outcome, numShares) => {
      console.log('Correct Place Hit');
      return {
        0: 3.50,
        1: 0.5
      };
    };
  });

  it('should dispatch clear market', () => {
    const expectedOutput = {
      type: 'CLEAR_TRADE_IN_PROGRESS',
      marketID: 'test'
    };
    assert.deepEqual(actions.clearTradeInProgress('test'), expectedOutput);
  });

  it('should update trades in progress', () => {
    // console.log(store.dispatch(actions.updateTradesInProgress('test', 'outcomeID', 3, 1)));
    return store.dispatch(actions.updateTradesInProgress('test', 'outcomeID', 3, 1))
      .then(() => { // return of async actions
        console.log(store.getActions())
      });
  });
});
