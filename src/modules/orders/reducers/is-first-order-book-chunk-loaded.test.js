import { UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED } from "modules/orders/actions/update-order-book";
import reducer from "modules/orders/reducers/is-first-order-book-chunk-loaded";

describe(`modules/orders/reducers/is-first-order-book-chunk-loaded.js`, () => {
  test("Should set isFirstOrderBookChunkLoaded to false", () => {
    const params = {
      MARKET_1: { 1: { buy: false } }
    };

    const action = {
      type: UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED,
      data: {
        marketId: "MARKET_0",
        outcome: 3,
        orderTypeLabel: "buy",
        isLoaded: false
      }
    };

    expect(reducer(params, action)).toEqual({
      MARKET_0: { 3: { buy: false } },
      MARKET_1: { 1: { buy: false } }
    });
  });
  test("Should change isFirstOrderBookChunkLoaded to true", () => {
    const params = {
      MARKET_0: { 3: { buy: false } },
      MARKET_1: { 1: { buy: false } }
    };
    const action = {
      type: UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED,
      data: {
        marketId: "MARKET_0",
        outcome: 3,
        orderTypeLabel: "buy",
        isLoaded: true
      }
    };

    expect(reducer(params, action)).toEqual({
      MARKET_0: { 3: { buy: true } },
      MARKET_1: { 1: { buy: false } }
    });
  });
});
