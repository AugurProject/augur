// Generic starting test state.
// Goal: To help keep these unit tests as DRY as possible.
import env from 'src/env'

import { formatNumber, formatShares } from 'utils/format-number'
import { formatDate } from 'utils/format-date'
import { BUY } from 'modules/transactions/constants/types'

const testState = {
  marketLoading: [],
  activeView: 'markets',
  accountTrades: {
    testMarketID: {
      testoutcomeID: [
        { type: 1, price: '0.5', amount: '50' }
      ]
    }
  },
  auth: {
    err: null,
    selectedAuthType: 'register'
  },
  blockchain: {
    currentBlockMillisSinceEpoch: 1461774253983,
    currentBlockTimestamp: 1461774253,
    currentBlockNumber: 833339
  },
  branch: {
    id: '0xf69b5',
    description: 'root branch',
    reportingPeriodDurationInSeconds: 4000,
    currentReportingWindowAddress: 19,
    currentReportingPeriodPercentComplete: 52
  },
  connection: {
    isConnected: true
  },
  createMarketInProgress: {},
  favorites: {
    testMarketID: true
  },
  env,
  loginAccount: {
    address: '0x0000000000000000000000000000000000000001',
    name: 'testTesterson',
    loginID: 'testSecureID',
    privateKey: Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex'),
    derivedKey: Buffer.from('0000000000000000000000000000000000000000000000000000000000000002', 'hex'),
    keystore: {
      address: '0x0000000000000000000000000000000000000001'
    },
    localNode: false,
    prettyAddress: '0xte...t123',
    linkText: 'testTesterson',
    prettyLoginID: 'test...reID',
    ethTokens: 0,
    ether: 0,
    realEther: 0,
    rep: 0
  },
  keywords: 'test testtag',
  marketsData: {
    testMarketID: {
      author: '0x0000000000000000000000000000000000000001',
      name: 'testMarket',
      description: 'some test description',
      endDate: 123,
      type: 'scalar',
      minPrice: 1,
      maxPrice: 2,
      settlementFee: 0.05,
      volume: 500,
      tags: ['tag1', 'tag2', 'tag3'],
      resolution: 'http://lmgtfy.com',
      creationTime: 100,
      creationBlock: 42,
      outstandingShares: formatShares(10),
      extraInfo: 'some extra info'
    },
    testMarketID2: {
      author: '0x0000000000000000000000000000000000000001',
      name: 'testMarket2',
      description: 'some test description',
      endDate: 123,
      type: 'binary',
      minPrice: 1,
      maxPrice: 2,
      settlementFee: 0.05,
      volume: 500,
      tags: ['tag1', 'tag2', 'tag3'],
      resolution: 'http://lmgtfy.com',
      creationTime: 100,
      creationBlock: 42,
      outstandingShares: formatShares(10),
      extraInfo: 'some extra info',
      numOutcomes: 2
    }
  },
  orderBooks: {
    testMarketID: {
      2: {
        buy: {
          '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3': {
            amount: '10',
            block: 1234,
            id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
            market: 'testMarketID',
            outcome: '2',
            owner: '0x7c0d52faab596c08f423e3478aebc6205f3f5d8c',
            price: '0.42',
            type: 'buy'
          },
          buyOrder2ID: {
            amount: '10',
            block: 1234,
            id: 'buyOrder2ID',
            market: 'testMarketID',
            outcome: '2',
            owner: '0x0000000000000000000000000000000000000001',
            price: '0.42',
            type: 'buy'
          }
        }
      },
      1: {
        buy: {
          buyOrder3ID: {
            amount: '10',
            block: 1234,
            id: 'buyOrder3ID',
            market: 'testMarketID',
            outcome: '1',
            owner: '0x0000000000000000000000000000000000000001',
            price: '0.42',
            type: 'buy'
          },
          buyOrder4ID: {
            amount: '10',
            block: 1234,
            id: 'buyOrder4ID',
            market: 'testMarketID',
            outcome: '1',
            owner: '0x0000000000000000000000000000000000000001',
            price: '0.44',
            type: 'buy'
          }
        },
        sell: {
          '0x8ef100c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb': {
            amount: '20',
            block: 1235,
            id: '0x8ef100c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb',
            market: 'testMarketID',
            outcome: '1',
            owner: '0x457435fbcd49475847f64898f933ffefc33388fc',
            price: '0.58',
            type: 'sell'
          },
          sellOrder2ID: {
            amount: '20',
            block: 1235,
            id: 'sellOrder2ID',
            market: 'testMarketID',
            outcome: '1',
            owner: '0x457435fbcd49475847f64898f933ffefc33388fc',
            price: '0.59',
            type: 'sell'
          }
        }
      }
    }
  },
  orderCancellation: {
    'an orderID': 'a status'
  },
  outcomesData: {
    testMarketID: {
      1: {
        id: '1',
        outstandingShares: '47',
        name: 'testOutcome',
        price: 35
      },
      2: {
        id: '2',
        outstandingShares: '156',
        name: 'testOutcome 2',
        price: 50
      },
      3: {
        id: '3',
        outstandingShares: '13',
        name: 'testOutcome 3',
        price: 48
      },
      4: {
        id: '4',
        outstandingShares: '156',
        name: 'testOutcome 4',
        price: 75
      }
    }
  },
  pagination: {
    numPerPage: 10,
    selectedPageNum: 1
  },
  priceHistory: {
    testMarketID: {},
    '0xMARKET1': {
      0: [
        { amount: 10 },
        { amount: 20 }
      ],
      1: [
        { amount: 10 },
        { amount: 20 }
      ]
    },
    '0xMARKET2': {
      0: [
        { amount: 10 },
        { amount: 20 }
      ],
      1: [
        { amount: 10 },
        { amount: 20 }
      ]
    },
  },
  reports: {
    '0xf69b5': {
      testMarketID: {
        marketID: 'testMarketID',
        isScalar: false,
        isIndeterminate: false,
        isSubmitted: false
      }
    }
  },
  selectedMarketID: 'testMarketID',
  selectedMarketsHeader: 'testMarketHeader',
  selectedFilterSort: {
    type: 'open',
    sort: 'volume',
    isDesc: true
  },
  selectedTags: {
    testtag: {
      name: 'testtag'
    },
    tag: {
      name: 'tag'
    }
  },
  tradesInProgress: {
    testMarketID: {
      numShares: 5000,
      limitPrice: '0.50',
      totalCost: '2500',
      type: 'binary',
      side: BUY
    }
  },
  transactionsData: {
    testtransaction12345: {
      id: 'testtransaction12345',
      message: 'CORS request rejected: https://faucet.augur.net/faucet/0x0000000000000000000000000000000000000001',
      status: 'failed',
      type: 'register',
      data: {}
    }
  },
  marketCreatorFees: {
    '0xMARKET1': 21
  },
  allMarkets: [
    {
      id: '0xMARKET1',
      author: '0x0000000000000000000000000000000000000001',
      description: 'test-market-1',
      endDate: formatDate(new Date('2017/12/12')),
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
              },
            ],
            ask: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              },
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
              },
            ],
            ask: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              },
            ]
          }
        }
      ]
    },
    {
      id: '0xMARKET2',
      author: '0x0000000000000000000000000000000000000001',
      description: 'test-market-2',
      endDate: formatDate(new Date('2017/12/12')),
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
              },
            ],
            ask: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              },
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
              },
            ],
            ask: [
              {
                shares: formatShares(10)
              },
              {
                shares: formatShares(10)
              },
            ]
          }
        }
      ]
    },
    {
      id: '0xMARKET3',
      author: '0xtest456'
    },
    {
      id: '0xMARKET4',
      author: '0xtest456'
    }
  ]
}

export default testState
