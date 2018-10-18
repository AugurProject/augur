jest.mock("modules/markets/selectors/market");
jest.mock("src/select-state");

describe(`modules/markets/selectors/markets-all.js`, () => {
  test(`should return the correct selectedMarket function`, () => {
    const { selectMarketsDataState } = require("src/select-state");
    selectMarketsDataState.__setSelectMarketsDataState(() => ({
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

    const markets = selectMarkets();

    expect(markets).toBeDefined();
    expect(markets).toHaveLength(3);
  });

  test(`should return zero markets`, () => {
    const { selectMarketsDataState } = require("src/select-state");
    selectMarketsDataState.__setSelectMarketsDataState(() => ({}));

    const { selectMarkets } = require("./markets-all");

    const markets = selectMarkets();

    expect(markets).toBeDefined();
    expect(markets).toHaveLength(0);
  });
});
