describe(`modules/markets/selectors/markets-all.js`, () => {
  jest.mock("./market");
  jest.mock("../../../select-state");
  const { selectMarket } = require("./market");
  const { selectMarketsDataState } = require("../../../select-state");

  selectMarket.mockImplementation(value => value);
  selectMarketsDataState.mockImplementation(() => ({
    test: {
      endTime: parseInt(new Date("01/01/3000").getTime() / 1000, 10),
      outcomes: {
        test: {}
      },
      volume: {
        value: 5
      }
    },
    test2: {
      endTime: parseInt(new Date("01/01/3000").getTime() / 1000, 10),
      outcomes: {
        test2: {}
      },
      volume: {
        value: 10
      }
    },
    test3: {
      endTime: parseInt(new Date("01/01/3000").getTime() / 1000, 10),
      outcomes: {
        test3: {}
      },
      volume: {
        value: 7
      }
    }
  }));

  const { selectMarkets } = require("./markets-all");

  test(`should return the correct selectedMarket function`, () => {
    const markets = selectMarkets();

    expect(markets).toBeDefined();
    expect(markets).toHaveLength(3);
  });
});
