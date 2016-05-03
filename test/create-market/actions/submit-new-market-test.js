import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../../src/modules/markets/constants/market-types';
import { PENDING, SUCCESS, FAILED, CREATING_MARKET } from '../../../src/modules/transactions/constants/statuses';

describe(`modules/create-market/actions/submit-new-market.js`, () => {
  proxyquire.noPreserveCache();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, action, out;
  let state = Object.assign({}, testState);
  store = mockStore(state);
  let testData = {
    type: 'UPDATE_TRANSACTIONS_DATA',
    test123: {
      type: 'create_market',
      gas: 0,
      ether: 0,
      data: {
        market: 'some marketdata'
      },
      action: 'do some action',
      status: 'pending'
    }
  };
  let fakeInclude = {};
  fakeInclude.addCreateMarketTransaction = (newMarket) => testData;
  let fakeAugurJS = {};
  fakeAugurJS.createMarket = (branch, market, cb) => {
    cb(null, {
      marketID: 'test123',
      status: SUCCESS,
      ...market
    });
  };
  let fakeLoadMarket = {};
  fakeLoadMarket.loadMarket = (marketID) => true;

  action = proxyquire('../../../src/modules/create-market/actions/submit-new-market', {
    '../../transactions/actions/add-create-market-transaction': fakeInclude,
    '../../../services/augurjs': fakeAugurJS,
    '../../markets/actions/load-market': fakeLoadMarket
  });

  beforeEach(() => {
    store.clearActions();
    // Mock the window object
    global.window = {};
    global.window.performance = {
      now: () => Date.now()
    };
    global.window.location = {
      pathname: '/test',
      search: 'example'
    };
    global.window.history = {
      state: [],
      pushState: (a, b, c) => window.history.state.push(c)
    };
    global.window.scrollTo = (x, y) => true;
  });

  afterEach(() => {
    global.window = {};
  });

  it(`should be able to submit a new market`, () => {

    store.dispatch(action.submitNewMarket({
      market: {
        id: 'market'
      }
    }));
    out = [{
      type: 'SHOW_LINK',
      parsedURL: {
        pathArray: ['/transactions'],
        searchParams: {},
        url: '/transactions'
      }
    }, {
      type: 'UPDATE_TRANSACTIONS_DATA',
      'test123': {
        type: 'create_market',
        gas: 0,
        ether: 0,
        data: {
          market: 'some marketdata'
        },
        action: 'do some action',
        status: 'pending'
      }
    }];

    assert.deepEqual(store.getActions(), out, `Didn't correctly create a new market`);
  });

  it(`should be able to create a new market`, () => {
    store.dispatch(action.createMarket('trans1234', {
      type: BINARY
    }));
    assert.deepEqual(store.getActions(), [{type: 'CLEAR_MAKE_IN_PROGRESS'}], `Didn't dispatch the right actions for a successfuly created binary market`);
    store.clearActions();
    fakeAugurJS.createMarket = (branch, market, cb) => {
      cb({message: 'test'}, {
        marketID: 'test123',
        status: '1234',
        ...market
      });
    };
    store.dispatch(action.createMarket('trans12345', {type: BINARY}));
    // console.log(store.getActions());
    assert.deepEqual(store.getActions(), [], `Didn't properly dispatch actions for a error when creating account`);
  });
});
