import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/positions/actions/load-account-trades.js`, () => {
  proxyquire.noPreserveCache();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, action, out;
  let state = Object.assign({}, testState);
  store = mockStore(state);
  let testData = {
    testTrade: {
      testOutcome: [{
        market: 'test',
        shares: 40,
        cost: 10
      }]
    }
  };

  let mockAugurJS = {
    loadAccountTrades: () => {}
  };

  let mock = sinon.stub(mockAugurJS, "loadAccountTrades", (loginID, cb) => cb(null, testData));

  action = proxyquire('../../../src/modules/positions/actions/load-account-trades', {
    '../../../services/augurjs': mockAugurJS
  });

  it(`should load trades from AugurJS for a given account id`, () => {
    out = [{
      type: 'UPDATE_ACCOUNT_TRADES_DATA',
      data: {
        test: {
          testOutcome: [{
            qtyShares: 40,
            purchasePrice: 10
          }]
        }
      }
    }];
    store.dispatch(action.loadAccountTrades());
    assert(mock.calledOnce, `Didn't call AugurJS.loadAccountTrades()`);
    assert.deepEqual(store.getActions(), out, `Didn't properly dispatch an UPDATE ACCOUNT TRADES DATA action`);
  });
});
