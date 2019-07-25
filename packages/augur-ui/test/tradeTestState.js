export {
  YES_NO,
  SCALAR,
  CATEGORICAL,
  BUY,
  SELL
} from "modules/common/constants";

export const tradeTestState = {
  loginAccount: {
    address: "testUser1",
    loginId: "longLoginId",
    localNode: false,
    eth: "5",
    ethTokens: "10000",
    rep: "50.0"
  },
  marketInfos: {
    testYesNoMarketId: {
      author: "testAuthor1",
      universeId: "0x010101",
      creationTime: 1475951522,
      numTicks: "10000",
      tickSize: "0.0001",
      description: "test yes/no  market?",
      endTime: 1495317600,
      consensus: null,
      isLoadedMarketInfo: true,
      maxPrice: "1",
      minPrice: "0",
      network: "2",
      numOutcomes: 2,
      category: "yes/no ",
      tags: ["yes/no ", "markets", null],
      settlementFee: "0.03",
      marketCreatorFeeRate: "0.02",
      reportingFeeRate: "0.01",
      tradingPeriod: 8653,
      marketType: "yes/no ",
      volume: "3030",
      isDisowned: false,
      outcomes: [
        {
          id: 0,
          description: "Invalid",
          outstandingShares: "2025",
          price: "0.5",
          sharesPurchased: "0"
        },
        {
          id: 1,
          description: "No",
          outstandingShares: "2025",
          price: "0.5",
          sharesPurchased: "0"
        },
        {
          id: 2,
          description: "Yes",
          outstandingShares: "1005",
          price: "0.5",
          sharesPurchased: "0"
        }
      ]
    },
    testCategoricalMarketId: {
      author: "testAuthor2",
      universeId: "0x010101",
      creationTime: 1476694751,
      numTicks: "10000",
      tickSize: "0.0001",
      description: "test categorical market?",
      endTime: 2066554498,
      details: "extra info",
      consensus: null,
      isLoadedMarketInfo: true,
      maxPrice: "1",
      minPrice: "0",
      network: "2",
      numOutcomes: 4,
      resolution: "http://lmgtfy.com",
      category: "categorical",
      tags: ["categorical", "markets", "test"],
      settlementFee: "0.03",
      marketCreatorFeeRate: "0.02",
      reportingFeeRate: "0.01",
      tradingPeriod: 11959,
      marketType: "categorical",
      volume: "0",
      isDisowned: false,
      outcomes: [
        {
          id: 0,
          description: "Democratic",
          outstandingShares: "0",
          price: "0",
          sharesPurchased: "0"
        },
        {
          id: 1,
          description: "Republican",
          outstandingShares: "0",
          price: "0",
          sharesPurchased: "0"
        },
        {
          id: 2,
          description: "Libertarian",
          outstandingShares: "0",
          price: "0",
          sharesPurchased: "0"
        },
        {
          id: 3,
          description: "Other",
          outstandingShares: "0",
          price: "0",
          sharesPurchased: "0"
        }
      ]
    },
    testScalarMarketId: {
      author: "testAuthor3",
      universeId: "0x010101",
      creationTime: 1476486515,
      tickSize: "0.1",
      numTicks: "1200",
      description: "test scalar market?",
      endTime: 1496514800,
      consensus: null,
      isLoadedMarketInfo: true,
      maxPrice: "110",
      minPrice: "-10",
      network: "2",
      numOutcomes: 2,
      resolution: "https://www.resolution-of-market.com",
      category: "scalar",
      tags: ["scalar", "markets", "test"],
      settlementFee: "0.03",
      marketCreatorFeeRate: "0.02",
      reportingFeeRate: "0.01",
      tradingPeriod: 8544,
      marketType: "scalar",
      volume: "0",
      isDisowned: false,
      outcomes: [
        {
          id: 0,
          description: "Invalid",
          outstandingShares: "2025",
          price: "0",
          sharesPurchased: "0"
        },
        {
          id: 1,
          description: "widgets",
          outstandingShares: "2025",
          price: "5",
          sharesPurchased: "0"
        },
        {
          id: 2,
          description: "widget",
          outstandingShares: "1005",
          price: "11",
          sharesPurchased: "0"
        }
      ]
    }
  },
  orderBooks: {
    testYesNoMarketId: {
      1: {
        buy: {
          orderId1: {
            orderId: "orderId1",
            amount: "10",
            price: "0.5",
            fullPrecisionAmount: "10",
            fullPrecisionPrice: "0.5",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "5"
          },
          orderId2: {
            orderId: "orderId2",
            amount: "10",
            price: "0.45",
            fullPrecisionAmount: "10",
            fullPrecisionPrice: "0.45",
            owner: "0xsomeoneElse",
            sharesEscrowed: "10",
            tokensEscrowed: "0"
          },
          orderId3: {
            orderId: "orderId3",
            amount: "1",
            price: "0.42",
            fullPrecisionAmount: "1",
            fullPrecisionPrice: "0.42",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "0.42"
          }
        },
        sell: {
          orderId4: {
            orderId: "orderId4",
            amount: ".5",
            price: "0.65",
            fullPrecisionAmount: "0.5",
            fullPrecisionPrice: "0.65",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "0.175"
          },
          orderId5: {
            orderId: "orderId5",
            amount: ".005",
            price: "0.7",
            fullPrecisionAmount: "0.005",
            fullPrecisionPrice: "0.7",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0.005",
            tokensEscrowed: "0"
          },
          orderId6: {
            orderId: "orderId6",
            amount: "12",
            price: "0.73",
            fullPrecisionAmount: "12",
            fullPrecisionPrice: "0.73",
            owner: "0xsomeoneElse",
            sharesEscrowed: "12",
            tokensEscrowed: "0"
          }
        }
      }
    },
    testCategoricalMarketId: {
      1: {
        buy: {
          orderId1: {
            orderId: "orderId1",
            amount: "10",
            price: "0.5",
            fullPrecisionAmount: "10",
            fullPrecisionPrice: "0.5",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "5"
          },
          orderId2: {
            orderId: "orderId2",
            amount: "1",
            price: "0.42",
            fullPrecisionAmount: "1",
            fullPrecisionPrice: "0.42",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "0.42"
          }
        },
        sell: {
          orderId3: {
            orderId: "orderId3",
            amount: ".005",
            price: "0.7",
            fullPrecisionAmount: "0.005",
            fullPrecisionPrice: "0.7",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0.005",
            tokensEscrowed: "0"
          },
          orderId4: {
            orderId: "orderId4",
            amount: "12",
            price: "0.73",
            fullPrecisionAmount: "12",
            fullPrecisionPrice: "0.73",
            owner: "0xsomeoneElse",
            sharesEscrowed: "12",
            tokensEscrowed: "0"
          }
        }
      }
    },
    testScalarMarketId: {
      1: {
        buy: {
          orderId1: {
            orderId: "orderId1",
            amount: "1.5",
            price: "50",
            fullPrecisionAmount: "1.5",
            fullPrecisionPrice: "50",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "90"
          },
          orderId2: {
            orderId: "orderId2",
            amount: "5",
            price: "25",
            fullPrecisionAmount: "5",
            fullPrecisionPrice: "25",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "175"
          },
          orderId3: {
            orderId: "orderId3",
            amount: "3.5",
            price: "0",
            fullPrecisionAmount: "3.5",
            fullPrecisionPrice: "0",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "35"
          },
          orderId4: {
            orderId: "orderId4",
            amount: "10",
            price: "-5",
            fullPrecisionAmount: "10",
            fullPrecisionPrice: "-5",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "50"
          },
          orderId5: {
            orderId: "orderId5",
            amount: "10",
            price: "-5",
            fullPrecisionAmount: "10",
            fullPrecisionPrice: "-5",
            owner: "0xsomeoneElse",
            sharesEscrowed: "10",
            tokensEscrowed: "0"
          }
        },
        sell: {
          orderId6: {
            orderId: "orderId6",
            amount: "0.5",
            price: "55",
            fullPrecisionAmount: "0.5",
            fullPrecisionPrice: "55",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "27.5"
          },
          orderId7: {
            orderId: "orderId7",
            amount: "7.5",
            price: "70",
            fullPrecisionAmount: "7.5",
            fullPrecisionPrice: "70",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "300"
          },
          orderId8: {
            orderId: "orderId8",
            amount: "2.5",
            price: "70",
            fullPrecisionAmount: "2.5",
            fullPrecisionPrice: "70",
            owner: "0xsomeoneElse",
            sharesEscrowed: "2.5",
            tokensEscrowed: "0"
          },
          orderId9: {
            orderId: "orderId9",
            amount: "2",
            price: "100",
            fullPrecisionAmount: "2",
            fullPrecisionPrice: "100",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "20"
          },
          orderId10: {
            orderId: "orderId10",
            amount: "13.5",
            price: "105",
            fullPrecisionAmount: "10",
            fullPrecisionPrice: "105",
            owner: "0xsomeoneElse",
            sharesEscrowed: "0",
            tokensEscrowed: "67.5"
          }
        }
      }
    }
  },
};
