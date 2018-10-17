import {
  UPDATE_MARKET_LOADING,
  REMOVE_MARKET_LOADING,
  updateMarketLoading,
  removeMarketLoading
} from "modules/markets/actions/update-market-loading";

describe("modules/markets/actions/update-market-loading.js", () => {
  const test = t => test(t.description, () => t.assertions());

  describe("updateMarketLoading", () => {
    test({
      description: "should return the expected object",
      assertions: () => {
        const actual = updateMarketLoading("0xMARKETID");
        const expected = {
          type: UPDATE_MARKET_LOADING,
          data: { marketLoadingState: "0xMARKETID" }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe("removeMarketLoading", () => {
    test({
      description: "should return the expected object",
      assertions: () => {
        const actual = removeMarketLoading("0xMARKETID");
        const expected = {
          type: REMOVE_MARKET_LOADING,
          data: { marketLoadingState: "0xMARKETID" }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });
});
