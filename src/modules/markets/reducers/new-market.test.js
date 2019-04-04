import newMarket from "modules/markets/reducers/new-market";
import { DEFAULT_SCALAR_TICK_SIZE } from "augur.js/src/constants";

import {
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET
} from "modules/markets/actions/update-new-market";

import { createBigNumber } from "utils/create-big-number";

describe("modules/markets/reducers/new-market.js", () => {
  test("should return the default state", () => {
    const actual = newMarket(undefined, { type: null });

    const expected = {
      isValid: false,
      currentStep: 0,
      type: "",
      scalarSmallNum: "",
      scalarBigNum: "",
      scalarDenomination: "",
      description: "",
      designatedReporterType: "",
      designatedReporterAddress: "",
      expirySourceType: "",
      expirySource: "",
      endTime: {},
      hour: "",
      minute: "",
      meridiem: "",
      detailsText: "",
      category: "",
      tag1: "",
      tag2: "",
      outcomes: Array(8).fill(""),
      tickSize: DEFAULT_SCALAR_TICK_SIZE,
      settlementFee: 0,
      orderBook: {},
      orderBookSorted: {},
      orderBookSeries: {},
      initialLiquidityEth: createBigNumber(0),
      initialLiquidityGas: createBigNumber(0),
      validations: [
        {
          description: null,
          category: null,
          tag1: "",
          tag2: "",
          type: null,
          designatedReporterType: null,
          designatedReporterAddress: null,
          expirySourceType: null,
          endTime: null,
          hour: null,
          minute: null,
          meridiem: null
        },
        {
          settlementFee: ""
        }
      ],
      creationError:
        "Unable to create market.  Ensure your market is unique and all values are valid."
    };

    expect(actual).toEqual(expected);
  });

  test("should return the existing value", () => {
    const actual = newMarket("testing", { type: null });
    const expected = "testing";
    expect(actual).toEqual(expected);
  });

  test("should add order to outcome with no previous orders", () => {
    const newMarketState = {
      test: "test",
      orderBook: {}
    };

    const actual = newMarket(newMarketState, {
      type: ADD_ORDER_TO_NEW_MARKET,
      data: {
        order: {
          outcome: "Outcome1",
          type: "bid",
          price: createBigNumber(0.5),
          quantity: createBigNumber(1),
          orderEstimate: "0.5 ETH"
        }
      }
    });

    const expected = {
      test: "test",
      orderBook: {
        Outcome1: [
          {
            type: "bid",
            price: createBigNumber(0.5),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.5)
          }
        ]
      }
    };

    expect(actual).toEqual(expected);
  });

  test("should add order to an existing outcome", () => {
    const newMarketState = {
      test: "test",
      orderBook: {
        Outcome1: [
          {
            type: "bid",
            price: createBigNumber(0.8),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.8)
          },
          {
            type: "ask",
            price: createBigNumber(0.9),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.1)
          }
        ]
      }
    };

    const actual = newMarket(newMarketState, {
      type: ADD_ORDER_TO_NEW_MARKET,
      data: {
        order: {
          outcome: "Outcome1",
          type: "bid",
          price: createBigNumber(0.5),
          quantity: createBigNumber(1),
          orderEstimate: "0.5 ETH"
        }
      }
    });

    const expected = {
      test: "test",
      orderBook: {
        Outcome1: [
          {
            type: "bid",
            price: createBigNumber(0.8),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.8)
          },
          {
            type: "ask",
            price: createBigNumber(0.9),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.1)
          },
          {
            type: "bid",
            price: createBigNumber(0.5),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.5)
          }
        ]
      }
    };

    expect(actual).toEqual(expected);
  });

  test("should add order to an existing outcome that has an order at that price point", () => {
    const newMarketState = {
      test: "test",
      orderBook: {
        Outcome1: [
          {
            type: "bid",
            price: createBigNumber(0.3),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.3)
          },
          {
            type: "ask",
            price: createBigNumber(0.9),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.1)
          }
        ]
      }
    };

    const actual = newMarket(newMarketState, {
      type: ADD_ORDER_TO_NEW_MARKET,
      data: {
        order: {
          outcome: "Outcome1",
          type: "bid",
          price: createBigNumber(0.3),
          quantity: createBigNumber(1),
          orderEstimate: "0.3 ETH"
        }
      }
    });

    const expected = {
      test: "test",
      orderBook: {
        Outcome1: [
          {
            type: "bid",
            price: createBigNumber(0.3),
            quantity: createBigNumber(2),
            orderEstimate: createBigNumber(0.6)
          },
          {
            type: "ask",
            price: createBigNumber(0.9),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.1)
          }
        ]
      }
    };

    expect(actual).toEqual(expected);
  });

  test("should add multiple orders to an existing outcome that has an orders at those price points", () => {
    const newMarketState = {
      test: "test",
      orderBook: {
        Outcome1: [
          {
            type: "bid",
            price: createBigNumber(0.3),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.3)
          },
          {
            type: "ask",
            price: createBigNumber(0.9),
            quantity: createBigNumber(1),
            orderEstimate: createBigNumber(0.1)
          }
        ]
      }
    };

    const action1 = newMarket(newMarketState, {
      type: ADD_ORDER_TO_NEW_MARKET,
      data: {
        order: {
          outcome: "Outcome1",
          type: "bid",
          price: createBigNumber(0.3),
          quantity: createBigNumber(1),
          orderEstimate: "0.3 ETH"
        }
      }
    });

    const action2 = newMarket(action1, {
      type: ADD_ORDER_TO_NEW_MARKET,
      data: {
        order: {
          outcome: "Outcome1",
          type: "ask",
          price: createBigNumber(0.9),
          quantity: createBigNumber(5),
          orderEstimate: "0.5 ETH"
        }
      }
    });

    const actual = newMarket(action2, {
      type: ADD_ORDER_TO_NEW_MARKET,
      data: {
        order: {
          outcome: "Outcome1",
          type: "bid",
          price: createBigNumber(0.3),
          quantity: createBigNumber(5),
          orderEstimate: "1.5 ETH"
        }
      }
    });

    const expected = {
      test: "test",
      orderBook: {
        Outcome1: [
          {
            type: "bid",
            price: createBigNumber(0.3),
            quantity: createBigNumber(7),
            orderEstimate: createBigNumber(2.1)
          },
          {
            type: "ask",
            price: createBigNumber(0.9),
            quantity: createBigNumber(6),
            orderEstimate: createBigNumber(0.6)
          }
        ]
      }
    };

    expect(actual).toEqual(expected);
  });

  test("should remove order", () => {
    const newMarketState = {
      test: "test",
      orderBook: {
        Outcome1: [
          {
            type: "bid",
            price: createBigNumber(0.8),
            quantity: createBigNumber(1)
          },
          {
            type: "ask",
            price: createBigNumber(0.9),
            quantity: createBigNumber(1)
          }
        ]
      }
    };

    const actual = newMarket(newMarketState, {
      type: REMOVE_ORDER_FROM_NEW_MARKET,
      data: {
        order: {
          outcome: "Outcome1",
          index: 0
        }
      }
    });

    const expected = {
      test: "test",
      orderBook: {
        Outcome1: [
          {
            type: "ask",
            price: createBigNumber(0.9),
            quantity: createBigNumber(1)
          }
        ]
      }
    };

    expect(actual).toEqual(expected);
  });

  test(`should update 'newMarket'`, () => {
    const newMarketState = {
      test: "test",
      anotherTest: ["test1", "test2"]
    };

    const actual = newMarket(newMarketState, {
      type: UPDATE_NEW_MARKET,
      data: {
        newMarketData: { test: "updated test" }
      }
    });

    const expected = {
      test: "updated test",
      anotherTest: ["test1", "test2"]
    };

    expect(actual).toEqual(expected);
  });

  test(`should clear 'newMarket'`, () => {
    const newMarketState = {
      test: "test",
      anotherTest: ["test1", "test2"]
    };

    const actual = newMarket(newMarketState, {
      type: CLEAR_NEW_MARKET
    });

    const expected = {
      isValid: false,
      currentStep: 0,
      type: "",
      scalarSmallNum: "",
      scalarBigNum: "",
      scalarDenomination: "",
      description: "",
      designatedReporterType: "",
      designatedReporterAddress: "",
      expirySourceType: "",
      expirySource: "",
      endTime: {},
      hour: "",
      minute: "",
      meridiem: "",
      detailsText: "",
      outcomes: Array(8).fill(""),
      tickSize: DEFAULT_SCALAR_TICK_SIZE,
      category: "",
      tag1: "",
      tag2: "",
      settlementFee: 0,
      orderBook: {},
      orderBookSorted: {},
      orderBookSeries: {},
      initialLiquidityEth: createBigNumber(0),
      initialLiquidityGas: createBigNumber(0),
      validations: [
        {
          description: null,
          category: null,
          tag1: "",
          tag2: "",
          type: null,
          designatedReporterType: null,
          designatedReporterAddress: null,
          expirySourceType: null,
          endTime: null,
          hour: null,
          minute: null,
          meridiem: null
        },
        {
          settlementFee: ""
        }
      ],
      creationError:
        "Unable to create market.  Ensure your market is unique and all values are valid."
    };

    expect(actual).toEqual(expected);
  });
});
