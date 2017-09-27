import { describe, it } from 'mocha';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';
import { assert } from 'chai';

describe(`modules/market/actions/load-price-history.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);

  const ACTIONS = {
    UPDATE_PRICE_HISTORY: { type: 'UPDATE_PRICE_HISTORY' }
  };
  const { loadPriceHistory, __RewireAPI__ } = require('modules/market/actions/load-price-history');

  const updateMarketPriceHistory = sinon.stub().returns(ACTIONS.UPDATE_PRICE_HISTORY);
  __RewireAPI__.__Rewire__('updateMarketPriceHistory', updateMarketPriceHistory);

  afterEach(() => {
    __RewireAPI__.__ResetDependency__('loadDataFromAugurNode', 'updateMarketPriceHistory');
  });

  const test = (t) => {
    it(t.description, (done) => {
      __RewireAPI__.__Rewire__('loadDataFromAugurNode', t.loadDataFromAugurNode);
      const store = mockStore(t.state || {});

      store.dispatch(loadPriceHistory(t.options, (err) => {
        t.assertions(err, store);
        done();
      }));
    });
  };

  test({
    description: `should call getPriceHistory and get update market price history action`,
    state: {
      branch: {
        id: '0x1344'
      },
      env: {
        augurNodeURL: 'blah.com'
      },
      loginAccount: {
        address: '0x1234567890'
      }
    },
    options: {
      market: '0xMarket'
    },
    loadDataFromAugurNode: (url, method, query, callback) => {
      callback(null, { value: 'test' });
    },
    assertions: (err, store) => {
      assert.isNull(err, 'no error is suppose to be');
      assert.deepEqual(store.getActions(), [ACTIONS.UPDATE_PRICE_HISTORY], 'one action fired');
    }
  });

  test({
    description: `should call getPriceHistory and get error with no actions`,
    state: {
      branch: {
        id: '0x1344'
      },
      env: {
        augurNodeURL: 'blah.com'
      },
      loginAccount: {
        address: '0x1234567890'
      }
    },
    options: {
      market: '0xMarket'
    },
    loadDataFromAugurNode: (url, method, query, callback) => {
      callback('ERROR', null);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, 'ERROR', 'yes error occured');
      assert.deepEqual(store.getActions(), [], 'no actions fired');
    }
  });

  test({
    description: `should call getPriceHistory, no address given, no error, no actions fired`,
    state: {
      loginAccount: {
      }
    },
    options: {
      market: '0xMarket'
    },
    loadDataFromAugurNode: (url, method, query, callback) => {
      callback(null, null);
    },
    assertions: (err, store) => {
      assert.isNull(err, 'no error is suppose to be');
      assert.deepEqual(store.getActions(), [], 'no actions fired');
    }
  });

  test({
    description: `should call getPriceHistory no history returned, error returned, no actions fired`,
    state: {
      branch: {
        id: '0x1344'
      },
      env: {
        augurNodeURL: 'blah.com'
      },
      loginAccount: {
        address: '0x1234567890'
      }
    },
    options: {
      market: '0xMarket'
    },
    loadDataFromAugurNode: (url, method, query, callback) => {
      callback(null, null);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, 'no price history data received from blah.com', 'yes error occured');
      assert.deepEqual(store.getActions(), [], 'no actions fired');
    }
  });

});
