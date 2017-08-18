import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { clearOrderBookOnFirstChunk } from 'modules/bids-asks/actions/clear-order-book-on-first-chunk';

describe(`modules/bids-asks/actions/clear-order-book-on-first-chunk.js`, () => {
  const test = t => it(t.description, () => {
    const store = configureMockStore([thunk])(Object.assign({}, t.mock.state));
    store.dispatch(clearOrderBookOnFirstChunk(t.params.marketID));
    t.assertions(store.getActions());
    store.clearActions();
  });
  test({
    description: 'first order book chunk not yet loaded: clear order book',
    params: {
      marketID: 'MARKET_0'
    },
    mock: {
      state: {
        isFirstOrderBookChunkLoaded: {
          MARKET_0: false
        }
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED',
        marketID: 'MARKET_0',
        isLoaded: true
      }, {
        type: 'CLEAR_MARKET_ORDER_BOOK',
        marketID: 'MARKET_0'
      }]);
    }
  });
  test({
    description: 'first order book chunk already loaded: do not clear order book',
    params: {
      marketID: 'MARKET_0'
    },
    mock: {
      state: {
        isFirstOrderBookChunkLoaded: {
          MARKET_0: true,
          MARKET_1: false
        }
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, []);
    }
  });
});
