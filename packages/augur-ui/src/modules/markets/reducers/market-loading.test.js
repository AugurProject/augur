import marketLoading from "modules/markets/reducers/market-loading";

import {
  UPDATE_MARKET_LOADING,
  REMOVE_MARKET_LOADING
} from "modules/markets/actions/update-market-loading";
import { RESET_STATE } from "modules/app/actions/reset-state";

describe("modules/markets/reducers/market-loading", () => {
  test("should return the default state, existing state undefined", () => {
    const actual = marketLoading(undefined, {
      type: null
    });

    const expected = {};

    expect(actual).toEqual(expected);
  });

  test("should return the default state when action type is RESET_STATE", () => {
    const actual = marketLoading(
      { "0xMarket1": "state" },
      { type: RESET_STATE }
    );

    const expected = {};

    expect(actual).toEqual(expected);
  });

  test("should return the existing state, existing state defined", () => {
    const actual = marketLoading(
      { "0xMarket1": "loading" },
      {
        type: null
      }
    );

    const expected = { "0xMarket1": "loading" };

    expect(actual).toEqual(expected);
  });

  test("should return the expected object for case UPDATE_MARKET_LOADING", () => {
    const actual = marketLoading(
      {},
      {
        type: UPDATE_MARKET_LOADING,
        data: {
          marketLoadingState: { "0xMARKETID": "current state" }
        }
      }
    );

    const expected = {
      "0xMARKETID": "current state"
    };

    expect(actual).toEqual(expected);
  });

  test("should return the expected object for case REMOVE_MARKET_LOADING", () => {
    const actual = marketLoading(
      {
        "0xMARKETID1": "state1",
        "0xMARKETID2": "state2"
      },
      {
        type: REMOVE_MARKET_LOADING,
        data: { marketLoadingState: "0xMARKETID1" }
      }
    );

    const expected = {
      "0xMARKETID2": "state2"
    };

    expect(actual).toEqual(expected);
  });
});
