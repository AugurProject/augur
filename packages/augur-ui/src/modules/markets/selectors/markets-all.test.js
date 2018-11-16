jest.mock("modules/markets/selectors/market");

describe(`modules/markets/selectors/markets-all.js`, () => {
  test(`should return the correct selectedMarket function`, () => {
    const state = {
      marketsData: {
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
      }
    };

    const { selectMarkets } = require("modules/markets/selectors/markets-all");

    const markets = selectMarkets(state);

    expect(markets).toBeDefined();
    expect(markets).toHaveLength(3);
  });

  test(`should return zero markets`, () => {
    const state = { marketsData: {} };
    const { selectMarkets } = require("modules/markets/selectors/markets-all");

    const markets = selectMarkets(state);

    expect(markets).toBeDefined();
    expect(markets).toHaveLength(0);
  });
});
