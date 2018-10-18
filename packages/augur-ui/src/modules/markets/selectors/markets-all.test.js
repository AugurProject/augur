describe(`modules/markets/selectors/markets-all.js`, () => {
  const state = Object.assign(
    {},
    {
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
      },
      priceHistory: {
        test: {},
        test2: {},
        test3: {}
      },
      favorites: {
        test: true,
        test2: true,
        test3: false
      },
      reports: {
        testEvent: {
          id: "testEvent"
        },
        testEvent2: {
          id: "testEvent2"
        },
        testEvent3: {
          id: "testEvent2"
        }
      },
      accountTrades: {
        test: {},
        test2: {},
        test3: {}
      },
      orderBooks: {
        test: {},
        test2: {},
        test3: {}
      },
      tradesInProgress: {
        test: {},
        test2: {},
        test3: {}
      }
    }
  );

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
    const markets = selectMarkets(state);

    expect(markets).toBeDefined();
    expect(markets).toHaveLength(3);
  });
});
