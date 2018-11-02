import realSelector from "modules/trades/selectors/trade-in-progress";

describe(`modules/trades/selectors/trade-in-progress.js`, () => {
  test(`should return tradesInProgress[selectedMarketId] if available`, () => {
    jest.mock("src/store", () => ({
      getState: () => ({
        selectedMarketId: "testmarket",
        tradesInProgress: {
          testmarket: "this is a test"
        }
      })
    }));
    const selector = require("modules/trades/selectors/trade-in-progress");

    expect(selector.default()).toEqual("this is a test");
  });

  test(`should return undefined if tradesInProgress[selectedMarketId] doesn't exist`, () => {
    expect(realSelector()).not.toBeDefined();
  });
});
