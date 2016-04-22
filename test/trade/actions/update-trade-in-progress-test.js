import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// going to need better test state data eventually...
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
        numShares: 100,
        limitPrice: 50,
        totalCost: 25,
        newPrice: 12,
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

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const fakeAugurJS = {};


describe('src/modules/trade/actions/trade-actions.js', () => {
  let sandbox;
  let actions;
  let store;
  console.log(new Date());

  beforeEach(() => {
    store = mockStore(testState);
    actions = proxyquire('../../../src/modules/trade/actions/update-trades-in-progress', {
      '../../../services/augurjs': fakeAugurJS
    });

    fakeAugurJS.getSimulatedBuy = (market, outcome, numShares) => {
      // console.log('fakeAugurJS.getSimulatedBuy() called.');
      return {
        0: 3.50,
        1: 0.5
      };
    };

    fakeAugurJS.getSimulatedSell = (market, outcome, numShares) => {
      // console.log('fakeAugurJS.getSimulatedSell() called.');
      return {
        0: 5.50,
        1: 1.5
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
    const expectedOutput = [{
      type: actions.UPDATE_TRADE_IN_PROGRESS,
      data: {
        marketID: 'test',
        outcomeID: 'outcomeID',
        details: {
          numShares: 3,
          limitPrice: 1,
          totalCost: 3.5,
          newPrice: 0.5
        }
      }
    }, {
      type: actions.UPDATE_TRADE_IN_PROGRESS,
      data: {
        marketID: 'test2',
        outcomeID: 'outcomeID2',
        details: {
          numShares: -6,
          limitPrice: 3,
          totalCost: 5.5,
          newPrice: 1.5
        }
      }
    }, {
      type: actions.UPDATE_TRADE_IN_PROGRESS,
      data: {
        marketID: 'test',
        outcomeID: 'outcomeID',
        details: {
          numShares: 4,
          limitPrice: 2,
          totalCost: 3.5,
          newPrice: 0.5
        }
      }
    }, {
      type: actions.UPDATE_TRADE_IN_PROGRESS,
      data: {
        marketID: 'test2',
        outcomeID: 'outcomeID2',
        details: {
          numShares: -4,
          limitPrice: 1,
          totalCost: 5.5,
          newPrice: 1.5
        }
      }
    }];
    store.dispatch(actions.updateTradesInProgress('test', 'outcomeID', 3, 1));
    store.dispatch(actions.updateTradesInProgress('test2', 'outcomeID2', -6, 3));
    store.dispatch(actions.updateTradesInProgress('test', 'outcomeID', 4, 2));
    store.dispatch(actions.updateTradesInProgress('test2', 'outcomeID2', -4, 1));

    assert.deepEqual(store.getActions(), expectedOutput);
  });
});
