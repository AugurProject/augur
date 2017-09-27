import loadMarkets from 'modules/markets/actions/load-markets';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/markets/actions/load-markets`, () => {
  const middlewares = [thunk];
  const augurNodeURL = 'blah.com';
  const mockStore = configureMockStore(middlewares);
  const state = {
    env: {
      augurNodeURL: augurNodeURL
    },
    branch: { id: 'branchid' }
  }
  const ACTIONS = {
    UPDATE_HAS_LOADED_MARKETS_TRUE: { type: 'UPDATE_HAS_LOADED_MARKETS', hasLoadedMarkets: true },
    UPDATE_HAS_LOADED_MARKETS_FALSE: { type: 'UPDATE_HAS_LOADED_MARKETS', hasLoadedMarkets: false },
    CLEAR_MARKET_DATA: { type: 'CLEAR_MARKET_DATA' },
    UPDATE_MARKET_DATA: { type: 'UPDATE_MARKETS_DATA' }
  };

  const updateHasLoadedMarkets = sinon.stub();
  updateHasLoadedMarkets.withArgs(true).returns(ACTIONS.UPDATE_HAS_LOADED_MARKETS_TRUE);
  updateHasLoadedMarkets.withArgs(false).returns(ACTIONS.UPDATE_HAS_LOADED_MARKETS_FALSE);

  const clearMarketsData = sinon.stub().returns(ACTIONS.CLEAR_MARKET_DATA);
  const updateMarketsData = sinon.stub().returns(ACTIONS.UPDATE_MARKET_DATA);

  loadMarkets.__Rewire__('updateHasLoadedMarkets', updateHasLoadedMarkets);
  loadMarkets.__Rewire__('clearMarketsData', clearMarketsData);
  loadMarkets.__Rewire__('updateMarketsData', updateMarketsData);

  afterEach(() => {
    loadMarkets.__ResetDependency__('loadDataFromAugurNode');
  });

  const test = (t) => {
    it(t.description, (done) => {
      const store = mockStore(state);
      loadMarkets.__Rewire__('loadDataFromAugurNode', t.loadDataFromAugurNode);

      store.dispatch(loadMarkets((err, data) => {
        t.assertions(err, store.getActions(), data);
        done();
      }));
    });
  };

  test({
    description: 'should dispatch the expected two actions and history is null err',
    loadDataFromAugurNode: (url, method, options, callback) => {
      callback(null, null)
    },
    assertions: (err, actions, data) => {
      const expected = [ACTIONS.UPDATE_HAS_LOADED_MARKETS_FALSE];
      assert.deepEqual(err, `no markets data received from ${augurNodeURL}`);
      assert.deepEqual(actions, expected, 'error was not handled as expected');
      assert.isUndefined(data, 'no market data provided');
    }
  });

  test({
    description: 'should dispatch the expected no actions with error from loader from augur node',
    loadDataFromAugurNode: (url, method, options, callback) => {
      callback('ERROR', null)
    },
    assertions: (err, actions, data) => {
      assert.deepEqual(err, 'ERROR', 'error should be ERROR');
      assert.deepEqual(actions, [], 'error was not handled as expected');
      assert.isUndefined(data, 'no market data provided');
    }
  });

  test({
    description: 'should dispatch no actions with no error with empty marketsData',
    loadDataFromAugurNode: (url, method, options, callback) => {
      callback(null, {})
    },
    assertions: (err, actions, data) => {
      const expected = [];
      assert.isNull(err, 'no error returned');
      assert.deepEqual(actions, expected, 'no actions fired');
      assert.isUndefined(data, 'no market data provided');
    }
  });

  test({
    description: 'should dispatch the expected all actions with no error and populated marketsData',
    loadDataFromAugurNode: (url, method, options, callback) => {
      callback(null, { key: 'key', value: 'value' })
    },
    assertions: (err, actions, data) => {
      const expected = [
        ACTIONS.CLEAR_MARKET_DATA, ACTIONS.UPDATE_MARKET_DATA, ACTIONS.UPDATE_HAS_LOADED_MARKETS_TRUE
      ];
      assert.isNull(err, 'no error returned');
      assert.deepEqual(actions, expected, 'returned object was not handled as expected');
      assert.deepEqual(data, { key: 'key', value: 'value' }, 'market data should equal object');
    }
  });

});
