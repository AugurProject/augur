import marketLoading from "modules/markets/reducers/market-loading";

import {
  UPDATE_MARKET_LOADING,
  REMOVE_MARKET_LOADING
} from "modules/markets/actions/update-market-loading";
import { RESET_STATE } from "modules/app/actions/reset-state";

describe("modules/markets/reducers/market-loading", () => {
  const test = t => it(t.description, () => t.assertions());

  test({
    description: "should return the default state, existing state undefined",
    assertions: () => {
      const actual = marketLoading(undefined, {
        type: null
      });

      const expected = {};

      assert.deepEqual(actual, expected, `Didn't return the expected object`);
    }
  });

  test({
    description:
      "should return the default state when action type is RESET_STATE",
    assertions: () => {
      const actual = marketLoading(
        { "0xMarket1": "state" },
        { type: RESET_STATE }
      );

      const expected = {};

      assert.deepEqual(actual, expected, `didn't return the expected value`);
    }
  });

  test({
    description: "should return the existing state, existing state defined",
    assertions: () => {
      const actual = marketLoading(
        { "0xMarket1": "loading" },
        {
          type: null
        }
      );

      const expected = { "0xMarket1": "loading" };

      assert.deepEqual(actual, expected, `Didn't return the expected object`);
    }
  });

  test({
    description:
      "should return the expected object for case UPDATE_MARKET_LOADING",
    assertions: () => {
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

      assert.deepEqual(actual, expected, `Didn't return the expected object`);
    }
  });

  test({
    description:
      "should return the expected object for case REMOVE_MARKET_LOADING",
    assertions: () => {
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

      assert.deepEqual(actual, expected, `Didn't return the expected object`);
    }
  });
});
