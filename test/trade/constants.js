export { BINARY, SCALAR, CATEGORICAL } from 'modules/markets/constants/market-types'
export { BUY, SELL } from 'modules/transactions/constants/types'

export const tradeTestState = {
  loginAccount: {
    address: 'testUser1',
    loginID: 'longLoginID',
    localNode: false,
    eth: '5',
    ethTokens: '10000',
    rep: '50.0'
  },
  selectedMarketID: 'testBinaryMarketID',
  marketsData: {
    testBinaryMarketID: {
      author: 'testAuthor1',
      universeID: '0x010101',
      creationFee: '22.5',
      creationTime: 1475951522,
      cumulativeScale: '1',
      description: 'test binary market?',
      endDate: 1495317600,
      consensus: null,
      isLoadedMarketInfo: true,
      maxPrice: '1',
      minPrice: '0',
      network: '2',
      numOutcomes: 2,
      topic: 'binary',
      tags: ['binary', 'markets', null],
      settlementFee: '0.01',
      reportingFeeRate: '0.02',
      tradingPeriod: 8653,
      type: 'binary',
      volume: '3030',
      isDisowned: false
    },
    testCategoricalMarketID: {
      author: 'testAuthor2',
      universeID: '0x010101',
      creationFee: '12.857142857142857142',
      creationTime: 1476694751,
      cumulativeScale: '1',
      description: 'test categorical market?',
      endDate: 2066554498,
      extraInfo: 'extra info',
      consensus: null,
      isLoadedMarketInfo: true,
      maxPrice: '1',
      minPrice: '0',
      network: '2',
      numOutcomes: 4,
      resolution: 'http://lmgtfy.com',
      topic: 'categorical',
      tags: ['categorical', 'markets', 'test'],
      settlementFee: '0.019999999999999999994',
      reportingFeeRate: '0.02',
      tradingPeriod: 11959,
      type: 'categorical',
      volume: '0',
      isDisowned: false
    },
    testScalarMarketID: {
      author: 'testAuthor3',
      universeID: '0x010101',
      creationFee: '9',
      creationTime: 1476486515,
      cumulativeScale: '130',
      description: 'test scalar market?',
      endDate: 1496514800,
      consensus: null,
      isLoadedMarketInfo: true,
      maxPrice: '120',
      minPrice: '-10',
      network: '2',
      numOutcomes: 2,
      resolution: 'https://www.resolution-of-market.com',
      topic: 'scalar',
      tags: ['scalar', 'markets', 'test'],
      settlementFee: '0.02',
      reportingFeeRate: '0.02',
      tradingPeriod: 8544,
      type: 'scalar',
      volume: '0',
      isDisowned: false
    },
  },
  outcomesData: {
    testBinaryMarketID: {
      1: {
        id: 1,
        name: 'Yes',
        outstandingShares: '1005',
        price: '0.5',
        sharesPurchased: '0'
      },
      0: {
        id: 0,
        name: 'No',
        outstandingShares: '2025',
        price: '0.5',
        sharesPurchased: '0'
      }
    },
    testCategoricalMarketID: {
      0: {
        name: 'Democratic',
        outstandingShares: '0',
        price: '0',
        sharesPurchased: '0'
      },
      1: {
        name: 'Republican',
        outstandingShares: '0',
        price: '0',
        sharesPurchased: '0'
      },
      2: {
        name: 'Libertarian',
        outstandingShares: '0',
        price: '0',
        sharesPurchased: '0'
      },
      3: {
        name: 'Other',
        outstandingShares: '0',
        price: '0',
        sharesPurchased: '0'
      }
    },
    testScalarMarketID: {
      0: {
        id: 0,
        name: '',
        outstandingShares: '0',
        price: '65',
        sharesPurchased: '0'
      },
      1: {
        id: 1,
        name: '',
        outstandingShares: '0',
        price: '65',
        sharesPurchased: '0'
      }
    },
  },
  tradesInProgress: {},
  transactionsData: {
    trans1: {
      data: {
        marketID: 'testBinaryMarketID',
        outcomeID: 1,
        marketType: 'binary',
        marketDescription: 'test binary market',
        outcomeName: 'YES'
      },
      feePercent: {
        value: '0.199203187250996016'
      }
    },
    trans2: {
      data: {
        marketID: 'testCategoricalMarketID',
        outcomeID: 0,
        marketType: 'categorical',
        marketDescription: 'test categorical market',
        outcomeName: 'Democratic'
      },
      feePercent: {
        value: '0.099800399201596707'
      }
    },
    trans3: {
      data: {
        marketID: 'testScalarMarketID',
        outcomeID: 0,
        marketType: 'scalar',
        marketDescription: 'test scalar market',
        outcomeName: ''
      },
      feePercent: {
        value: '0.95763203714451532'
      }
    }
  },
}
