import { describe, it } from 'mocha';
import { assert } from 'chai';
import { UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED } from 'modules/bids-asks/actions/update-market-order-book';
import reducer from 'modules/bids-asks/reducers/is-first-order-book-chunk-loaded';

describe(`modules/bids-asks/reducers/is-first-order-book-chunk-loaded.js`, () => {
  const test = t => it(t.description, () => (
    t.assertions(reducer(t.params.isFirstOrderBookLoaded, t.params.action))
  ));
  test({
    description: 'Should set isFirstOrderBookChunkLoaded to false',
    params: {
      isFirstOrderBookLoaded: {
        MARKET_1: false
      },
      action: {
        type: UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED,
        marketID: 'MARKET_0',
        isLoaded: false
      }
    },
    assertions: (output) => {
      assert.deepEqual(output, {
        MARKET_0: false,
        MARKET_1: false
      });
    }
  });
  test({
    description: 'Should change isFirstOrderBookChunkLoaded to true',
    params: {
      isFirstOrderBookLoaded: {
        MARKET_0: false,
        MARKET_1: false
      },
      action: {
        type: UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED,
        marketID: 'MARKET_0',
        isLoaded: true
      }
    },
    assertions: (output) => {
      assert.deepEqual(output, {
        MARKET_0: true,
        MARKET_1: false
      });
    }
  });
});
