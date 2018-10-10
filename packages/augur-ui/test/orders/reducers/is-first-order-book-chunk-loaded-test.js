import { UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED } from "modules/orders/actions/update-order-book";
import reducer from "modules/orders/reducers/is-first-order-book-chunk-loaded";

describe(`modules/orders/reducers/is-first-order-book-chunk-loaded.js`, () => {
  const test = t =>
    it(t.description, () =>
      t.assertions(reducer(t.params.isFirstOrderBookLoaded, t.params.action))
    );
  test({
    description: "Should set isFirstOrderBookChunkLoaded to false",
    params: {
      isFirstOrderBookLoaded: {
        MARKET_1: { 1: { buy: false } }
      },
      action: {
        type: UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED,
        data: {
          marketId: "MARKET_0",
          outcome: 3,
          orderTypeLabel: "buy",
          isLoaded: false
        }
      }
    },
    assertions: output => {
      assert.deepEqual(output, {
        MARKET_0: { 3: { buy: false } },
        MARKET_1: { 1: { buy: false } }
      });
    }
  });
  test({
    description: "Should change isFirstOrderBookChunkLoaded to true",
    params: {
      isFirstOrderBookLoaded: {
        MARKET_0: { 3: { buy: false } },
        MARKET_1: { 1: { buy: false } }
      },
      action: {
        type: UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED,
        data: {
          marketId: "MARKET_0",
          outcome: 3,
          orderTypeLabel: "buy",
          isLoaded: true
        }
      }
    },
    assertions: output => {
      assert.deepEqual(output, {
        MARKET_0: { 3: { buy: true } },
        MARKET_1: { 1: { buy: false } }
      });
    }
  });
});
