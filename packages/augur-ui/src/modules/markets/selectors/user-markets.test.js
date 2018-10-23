import { createBigNumber } from "utils/create-big-number";
import { formatNumber, formatEther, formatShares } from "utils/format-number";
import { formatDate } from "utils/format-date";

jest.mock("modules/markets/selectors/markets-all");

describe("modules/markets/selectors/user-markets", () => {
  const state = {
    marketsData: {
      "0xMARKET1": {
        author: "0x0000000000000000000000000000000000000001",
        id: "0xMARKET1",
        description: "test-market-1",
        endTime: formatDate(new Date("2017/12/12")),
        repBalance: undefined,
        fees: formatEther(createBigNumber("10", 10)),
        volume: formatNumber(100),
        outcomes: [
          {
            orderBook: {
              bid: [
                {
                  shares: formatShares(10)
                },
                {
                  shares: formatShares(10)
                }
              ],
              ask: [
                {
                  shares: formatShares(10)
                },
                {
                  shares: formatShares(10)
                }
              ]
            }
          },
          {
            orderBook: {
              bid: [
                {
                  shares: formatShares(10)
                },
                {
                  shares: formatShares(10)
                }
              ],
              ask: [
                {
                  shares: formatShares(10)
                },
                {
                  shares: formatShares(10)
                }
              ]
            }
          }
        ]
      },
      "0xMARKET2": {
        author: "0x0000000000000000000000000000000000000001",
        id: "0xMARKET2",
        description: "test-market-2",
        endTime: formatDate(new Date("2017/12/12")),
        repBalance: undefined,
        volume: formatNumber(100),
        outcomes: [
          {
            orderBook: {
              bid: [
                {
                  shares: formatShares(10)
                },
                {
                  shares: formatShares(10)
                }
              ],
              ask: [
                {
                  shares: formatShares(10)
                },
                {
                  shares: formatShares(10)
                }
              ]
            }
          },
          {
            orderBook: {
              bid: [
                {
                  shares: formatShares(10)
                },
                {
                  shares: formatShares(10)
                }
              ],
              ask: [
                {
                  shares: formatShares(10)
                },
                {
                  shares: formatShares(10)
                }
              ]
            }
          }
        ]
      }
    },
    marketCreatorFees: {
      "0xMARKET1": createBigNumber("10", 10),
      "0xMARKET2": createBigNumber("11", 10)
    },
    loginAccount: {
      address: "0x0000000000000000000000000000000000000001"
    },
    priceHistory: {
      testMarketId: {},
      "0xMARKET1": {
        0: [{ amount: 10 }, { amount: 20 }],
        1: [{ amount: 10 }, { amount: 20 }]
      },
      "0xMARKET2": {
        0: [{ amount: 10 }, { amount: 20 }],
        1: [{ amount: 10 }, { amount: 20 }]
      }
    }
  };
  const selectMarketAll = require("modules/markets/selectors/markets-all");
  selectMarketAll.selectMarkets.__set(
    Object.keys(state.marketsData).map(marketId => state.marketsData[marketId])
  );

  const selector = require("modules/markets/selectors/user-markets");

  const actual = selector.getUserMarkets(state);

  const expected = [
    {
      author: "0x0000000000000000000000000000000000000001",
      id: "0xMARKET1",
      description: "test-market-1",
      endTime: formatDate(new Date("2017/12/12")),
      repBalance: undefined,
      volume: formatNumber(100),
      fees: formatEther(createBigNumber("10", 10)),
      numberOfTrades: formatNumber(4),
      averageTradeSize: formatNumber(15),
      openVolume: formatNumber(80),
      outcomes: [
        {
          orderBook: {
            bid: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              }
            ],
            ask: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              }
            ]
          }
        },
        {
          orderBook: {
            bid: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              }
            ],
            ask: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              }
            ]
          }
        }
      ]
    },
    {
      author: "0x0000000000000000000000000000000000000001",
      id: "0xMARKET2",
      description: "test-market-2",
      endTime: formatDate(new Date("2017/12/12")),
      repBalance: undefined,
      volume: formatNumber(100),
      fees: formatEther(createBigNumber("11", 10)),
      numberOfTrades: formatNumber(4),
      averageTradeSize: formatNumber(15),
      openVolume: formatNumber(80),
      outcomes: [
        {
          orderBook: {
            bid: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              }
            ],
            ask: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              }
            ]
          }
        },
        {
          orderBook: {
            bid: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              }
            ],
            ask: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              }
            ]
          }
        }
      ]
    }
  ];

  test("should return the expected array", () => {
    expect(actual).toEqual(expected);
  });
});
