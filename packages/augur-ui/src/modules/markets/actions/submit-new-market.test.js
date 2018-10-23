import { createBigNumber } from "utils/create-big-number";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { BUY, SELL } from "modules/transactions/constants/types";
import { buildCreateMarket } from "modules/markets/helpers/build-create-market";

jest.mock("modules/transactions/actions/add-transactions");
jest.mock("modules/markets/helpers/build-create-market");

describe("modules/markets/actions/submit-new-market", () => {
  const mockStore = configureMockStore([thunk]);
  const pendingTransaction = { type: "ADD_NEW_MARKET_CREATION_TRANSACTIONS" };
  const clearNewMarket = { type: "CLEAR_NEW_MARKET" };
  const invalidateMarketCreation = {
    data: { newMarketData: { isValid: false } },
    type: "UPDATE_NEW_MARKET"
  };
  const {
    submitNewMarket
  } = require("modules/markets/actions/submit-new-market");

  const history = {
    push: jest.fn()
  };

  describe("successful create market tests", () => {
    beforeEach(() => {
      history.push.mockClear();
      buildCreateMarket.mockImplementationOnce(() => ({
        createMarket: jest.fn(value => {
          value.onSent({
            callReturn: "marketId"
          });
          value.onSuccess({
            res: {
              callReturn: "marketId"
            }
          });
        }),
        formattedNewMarket: {}
      }));
    });

    test(`should dispatch the expected action and call the expected function from the 'onSent' callback`, () => {
      const state = {
        universe: {
          id: "1010101"
        },
        contractAddresses: {
          Cash: "domnination"
        },
        loginAccount: {
          meta: {
            test: "object"
          },
          address: "0x1233"
        },
        newMarket: {
          properties: "value",
          orderBook: {}
        }
      };
      const store = mockStore(state || {});
      store.dispatch(submitNewMarket(store.getState().newMarket, history));
      expect(history.push).toHaveBeenCalledTimes(1);
      const actual = store.getActions();
      const expected = [pendingTransaction, clearNewMarket];
      expect(actual).toEqual(expected);
    });

    test(`should dispatch the expected actions from the 'onSuccess' callback when an orderbook IS present`, () => {
      const state = {
        universe: {
          id: "1010101"
        },
        contractAddresses: {
          Cash: "domnination"
        },
        loginAccount: {
          meta: {
            test: "object"
          },
          address: "0x1233",
          allowance: "100"
        },
        newMarket: {
          properties: "value",
          outcomes: ["one", "two"],
          orderBook: {
            one: [
              {
                type: BUY,
                price: createBigNumber("0.1"),
                quantity: createBigNumber("1")
              },
              {
                type: SELL,
                price: createBigNumber("0.6"),
                quantity: createBigNumber("1")
              },
              {
                type: BUY,
                price: createBigNumber("0.2"),
                quantity: createBigNumber("1")
              },
              {
                type: SELL,
                price: createBigNumber("0.7"),
                quantity: createBigNumber("1")
              },
              {
                type: BUY,
                price: createBigNumber("0.3"),
                quantity: createBigNumber("1")
              },
              {
                type: SELL,
                price: createBigNumber("0.8"),
                quantity: createBigNumber("1")
              }
            ],
            two: [
              {
                type: BUY,
                price: createBigNumber("0.1"),
                quantity: createBigNumber("1")
              },
              {
                type: SELL,
                price: createBigNumber("0.6"),
                quantity: createBigNumber("1")
              },
              {
                type: BUY,
                price: createBigNumber("0.2"),
                quantity: createBigNumber("1")
              },
              {
                type: SELL,
                price: createBigNumber("0.7"),
                quantity: createBigNumber("1")
              },
              {
                type: BUY,
                price: createBigNumber("0.3"),
                quantity: createBigNumber("1")
              },
              {
                type: SELL,
                price: createBigNumber("0.8"),
                quantity: createBigNumber("1")
              }
            ]
          }
        }
      };
      const store = mockStore(state || {});
      store.dispatch(submitNewMarket(store.getState().newMarket, history));

      const actual = store.getActions();
      // note the liquidity orders are now sorted in the output.
      const addMarketLiquidityOrders = {
        type: "ADD_MARKET_LIQUIDITY_ORDERS",
        data: {
          marketId: "marketId",
          liquidityOrders: {
            one: [
              {
                type: SELL,
                price: createBigNumber("0.8"),
                quantity: createBigNumber("1")
              },
              {
                type: SELL,
                price: createBigNumber("0.7"),
                quantity: createBigNumber("1")
              },
              {
                type: SELL,
                price: createBigNumber("0.6"),
                quantity: createBigNumber("1")
              },
              {
                type: BUY,
                price: createBigNumber("0.3"),
                quantity: createBigNumber("1")
              },
              {
                type: BUY,
                price: createBigNumber("0.2"),
                quantity: createBigNumber("1")
              },
              {
                type: BUY,
                price: createBigNumber("0.1"),
                quantity: createBigNumber("1")
              }
            ],
            two: [
              {
                type: SELL,
                price: createBigNumber("0.8"),
                quantity: createBigNumber("1")
              },
              {
                type: SELL,
                price: createBigNumber("0.7"),
                quantity: createBigNumber("1")
              },
              {
                type: SELL,
                price: createBigNumber("0.6"),
                quantity: createBigNumber("1")
              },
              {
                type: BUY,
                price: createBigNumber("0.3"),
                quantity: createBigNumber("1")
              },
              {
                type: BUY,
                price: createBigNumber("0.2"),
                quantity: createBigNumber("1")
              },
              {
                type: BUY,
                price: createBigNumber("0.1"),
                quantity: createBigNumber("1")
              }
            ]
          }
        }
      };
      const expected = [
        pendingTransaction,
        clearNewMarket,
        addMarketLiquidityOrders
      ];
      expect(history.push).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(expected);
    });

    test(`should dispatch the expected actions from the 'onSuccess' callback when an orderbook IS NOT present`, () => {
      const state = {
        universe: {
          id: "1010101"
        },
        contractAddresses: {
          Cash: "domnination"
        },
        loginAccount: {
          meta: {
            test: "object"
          },
          address: "0x1233"
        },
        newMarket: { properties: "value", orderBook: {} }
      };
      const store = mockStore(state || {});
      store.dispatch(submitNewMarket(store.getState().newMarket, history));
      const actual = store.getActions();
      const expected = [pendingTransaction, clearNewMarket];
      expect(history.push).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(expected);
    });
  });

  describe("not successful test", () => {
    beforeEach(() => {
      history.push.mockClear();
      buildCreateMarket.mockImplementationOnce(() => ({
        createMarket: jest.fn(value => {
          value.onSent();
          value.onFailed({
            message: "blah error blah"
          });
        }),
        formattedNewMarket: {}
      }));
    });

    test(`should dispatch the expected actions from the 'onFailed' callback`, () => {
      const state = {
        universe: {
          id: "1010101"
        },
        contractAddresses: {
          Cash: "domnination"
        },
        loginAccount: {
          meta: {
            test: "object"
          },
          address: "0x1233"
        },
        newMarket: { properties: "value", orderBook: {} }
      };
      const store = mockStore(state || {});
      store.dispatch(submitNewMarket(store.getState().newMarket, history));
      const actual = store.getActions();
      const expected = [
        pendingTransaction,
        clearNewMarket,
        invalidateMarketCreation
      ];
      expect(history.push).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(expected);
    });
  });
});
