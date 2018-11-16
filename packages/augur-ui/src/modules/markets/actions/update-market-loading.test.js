import {
  UPDATE_MARKET_LOADING,
  REMOVE_MARKET_LOADING,
  updateMarketLoading,
  removeMarketLoading
} from "modules/markets/actions/update-market-loading";

describe("modules/markets/actions/update-market-loading.js", () => {
  test("should return the expected object", () => {
    const actual = updateMarketLoading("0xMARKETID");
    const expected = {
      type: UPDATE_MARKET_LOADING,
      data: { marketLoadingState: "0xMARKETID" }
    };

    expect(actual).toEqual(expected);
  });

  test("should return the expected remove market loading object", () => {
    const actual = removeMarketLoading("0xMARKETID");
    const expected = {
      type: REMOVE_MARKET_LOADING,
      data: { marketLoadingState: "0xMARKETID" }
    };

    expect(actual).toEqual(expected);
  });
});
