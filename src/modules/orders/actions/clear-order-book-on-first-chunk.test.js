import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import clearOrderBookOnFirstChunk from "modules/orders/actions/clear-order-book-on-first-chunk";

describe(`modules/orders/actions/clear-order-book-on-first-chunk.js`, () => {
  test("first order book chunk not yet loaded: clear order book", () => {
    const params = {
      marketId: "MARKET_0",
      outcome: 2,
      orderTypeLabel: "buy"
    };
    const state = {
      isFirstOrderBookChunkLoaded: {
        MARKET_0: { 2: { buy: false } }
      }
    };

    const store = configureMockStore([thunk])(state);
    store.dispatch(
      clearOrderBookOnFirstChunk(
        params.marketId,
        params.outcome,
        params.orderTypeLabel
      )
    );
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED",
        data: {
          marketId: "MARKET_0",
          outcome: 2,
          orderTypeLabel: "buy",
          isLoaded: true
        }
      },
      {
        type: "CLEAR_ORDER_BOOK",
        data: {
          marketId: "MARKET_0",
          outcome: 2,
          orderTypeLabel: "buy"
        }
      }
    ]);
  });

  test("first order book chunk already loaded: do not clear order book", () => {
    const params = {
      marketId: "MARKET_0",
      outcome: 2,
      orderTypeLabel: "buy"
    };
    const state = {
      isFirstOrderBookChunkLoaded: {
        MARKET_0: { 2: { buy: true } },
        MARKET_1: { 1: { buy: false } }
      }
    };
    const store = configureMockStore([thunk])(state);
    store.dispatch(
      clearOrderBookOnFirstChunk(
        params.marketId,
        params.outcome,
        params.orderTypeLabel
      )
    );

    expect(store.getActions()).toEqual([]);
  });
});
