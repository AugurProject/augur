import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { augur } from "services/augurjs";

const order1 = { amount: "1" };
const order2 = { amount: "1.2" };
const marketsData = { MARKET_0: { minPrice: "0", maxPrice: "1" } };

jest.mock("services/augurjs");

describe(`modules/orders/actions/load-one-outcome-bids-or-asks.js`, () => {
  augur.trading = jest.fn(() => {});
  augur.trading.getOrders = jest.fn(() => {});

  jest.setMock(
    "modules/orders/actions/insert-order-book-chunk-to-order-book",
    () => ({
      type: "INSERT_CHUNK_ORDER_BOOK"
    })
  );

  beforeAll(() => {
    augur.trading.getOrders.mockImplementation((params, cb) => {
      if (!params.marketId || !params.outcome) return "ERROR";
      cb(null);
    });
  });

  const loadOneOutcomeBidsOrAsks = require("modules/orders/actions/load-one-outcome-bids-or-asks")
    .default;

  test("short-circuit if market ID not provided", () => {
    const params = {
      marketId: undefined,
      outcome: 3,
      orderTypeLabel: "sell"
    };
    const store = configureMockStore([thunk])({ marketsData });
    store.dispatch(
      loadOneOutcomeBidsOrAsks(
        params.marketId,
        params.outcome,
        params.orderTypeLabel,
        err => {
          expect(err).toEqual(
            "must specify market ID, outcome, and order type: undefined 3 sell"
          );
          expect(store.getActions()).toEqual([]);
        }
      )
    );
  });

  test("short-circuit if outcome not provided", () => {
    const params = {
      marketId: "MARKET_0",
      outcome: undefined,
      orderTypeLabel: "sell"
    };
    const store = configureMockStore([thunk])({ marketsData });
    store.dispatch(
      loadOneOutcomeBidsOrAsks(
        params.marketId,
        params.outcome,
        params.orderTypeLabel,
        err => {
          expect(err).toEqual(
            "must specify market ID, outcome, and order type: MARKET_0 undefined sell"
          );
          expect(store.getActions()).toEqual([]);
        }
      )
    );
  });

  test("short-circuit if orderType not provided", () => {
    const params = {
      marketId: "MARKET_0",
      outcome: 3,
      orderType: undefined
    };
    const store = configureMockStore([thunk])({ marketsData });
    store.dispatch(
      loadOneOutcomeBidsOrAsks(
        params.marketId,
        params.outcome,
        params.orderTypeLabel,
        err => {
          expect(err).toEqual(
            "must specify market ID, outcome, and order type: MARKET_0 3 undefined"
          );
          expect(store.getActions()).toEqual([]);
        }
      )
    );
  });

  test("short-circuit if market data not found", () => {
    const params = {
      marketId: "MARKET_0",
      outcome: 3,
      orderTypeLabel: "sell"
    };
    const store = configureMockStore([thunk])({ marketsData: {} });
    store.dispatch(
      loadOneOutcomeBidsOrAsks(
        params.marketId,
        params.outcome,
        params.orderTypeLabel,
        err => {
          expect(err).toEqual("market MARKET_0 data not found");
          expect(store.getActions()).toEqual([]);
        }
      )
    );
  });

  test("no orders found", () => {
    const params = {
      marketId: "MARKET_0",
      outcome: 3,
      orderTypeLabel: "sell"
    };
    const store = configureMockStore([thunk])({ marketsData });
    store.dispatch(
      loadOneOutcomeBidsOrAsks(
        params.marketId,
        params.outcome,
        params.orderTypeLabel,
        err => {
          expect(err).toBeNull();
          expect(store.getActions()).toEqual([
            {
              data: {
                isLoaded: false,
                marketId: "MARKET_0",
                orderTypeLabel: "sell",
                outcome: 3
              },
              type: "UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED"
            }
          ]);
        }
      )
    );
  });

  test("load two orders", () => {
    augur.trading.getOrders.mockImplementation((params, cb) => {
      if (!params.marketId || !params.outcome) return "ERROR";
      cb(null, {
        MARKET_0: {
          3: {
            sell: {
              "0x1": order1,
              "0x2": order2
            }
          }
        }
      });
    });
    const params = {
      marketId: "MARKET_0",
      outcome: 3,
      orderTypeLabel: "sell"
    };
    const store = configureMockStore([thunk])({ marketsData });
    store.dispatch(
      loadOneOutcomeBidsOrAsks(
        params.marketId,
        params.outcome,
        params.orderTypeLabel,
        err => {
          expect(err).toBeNull();
          expect(store.getActions()).toEqual([
            {
              data: {
                isLoaded: false,
                marketId: "MARKET_0",
                orderTypeLabel: "sell",
                outcome: 3
              },
              type: "UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED"
            },
            { type: "INSERT_CHUNK_ORDER_BOOK" }
          ]);
        }
      )
    );
  });
});
