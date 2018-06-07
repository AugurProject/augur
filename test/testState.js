// Generic starting test state.
// Goal: To help keep these unit tests as DRY as possible.
import network from 'config/network'

import { formatNumber, formatShares } from 'utils/format-number'
import { formatDate } from 'utils/format-date'
import { BUY } from 'modules/transactions/constants/types'

const testState = {
  marketLoading: [],
  activeView: 'markets',
  accountTrades: {
    testMarketId: {
      testoutcomeId: [
        { type: 1, price: '0.5', amount: '50' },
      ],
    },
  },
  auth: {
    err: null,
    selectedAuthType: 'register',
  },
  blockchain: {
    currentBlockTimestamp: 1461774253,
    currentBlockNumber: 833339,
  },
  universe: {
    id: '0xf69b5',
    description: 'root universe',
    reportingPeriodDurationInSeconds: 4000,
    currentReportingWindowAddress: 19,
    currentReportingPeriodPercentComplete: 52,
  },
  connection: {
    isConnected: true,
    isConnectedToAugurNode: true,
    augurNodeNetworkId: '4',
    isReconnectionPaused: false,
  },
  createMarketInProgress: {},
  favorites: {
    testMarketId: true,
  },
  env: network[`${process.env.ETHEREUM_NETWORK || 'dev'}`],
  loginAccount: {
    address: '0x0000000000000000000000000000000000000001',
    name: 'testTesterson',
    loginId: 'testSecureId',
    privateKey: Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex'),
    derivedKey: Buffer.from('0000000000000000000000000000000000000000000000000000000000000002', 'hex'),
    keystore: {
      address: '0x0000000000000000000000000000000000000001',
    },
    localNode: false,
    prettyAddress: '0xte...t123',
    linkText: 'testTesterson',
    prettyLoginId: 'test...reId',
    ethTokens: 0,
    ether: 0,
    realEther: 0,
    rep: 0,
  },
  tags: 'test testtag',
  marketsData: {
    testMarketId: {
      id: 'testMarketId',
      consensus: null,
      author: '0x0000000000000000000000000000000000000001',
      name: 'testMarket',
      description: 'some test description',
      endTime: 123,
      minPrice: 1,
      maxPrice: 2,
      volume: 500,
      tags: ['tag1', 'tag2', 'tag3'],
      resolution: 'http://lmgtfy.com',
      creationTime: 100,
      creationBlock: 42,
      numOutcomes: 2,
      marketType: 'yes/no ',
      outstandingShares: formatShares(10),
      details: 'some extra info',
      settlementFee: '0.000100000001193046',
      reportingFeeRate: 0.0001,
      creationFee: 0.025,
      marketCreatorFeeRate: 0.00000000001193046,
    },
    testMarketId2: {
      id: 'testMarketId2',
      consensus: null,
      author: '0x0000000000000000000000000000000000000001',
      name: 'testMarket2',
      description: 'some test description',
      endTime: 123,
      minPrice: 1,
      maxPrice: 2,
      marketType: 'yes/no ',
      volume: 500,
      tags: ['tag1', 'tag2', 'tag3'],
      resolution: 'http://lmgtfy.com',
      creationTime: 100,
      creationBlock: 42,
      outstandingShares: formatShares(10),
      details: 'some extra info',
      numOutcomes: 2,
      settlementFee: '0.000100000001193046',
      reportingFeeRate: 0.0001,
      creationFee: 0.025,
      marketCreatorFeeRate: 0.00000000001193046,
    },
  },
  orderBooks: {
    testMarketId: {
      2: {
        buy: {
          '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3': {
            amount: '10',
            block: 1234,
            id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
            market: 'testMarketId',
            outcome: '2',
            owner: '0x7c0d52faab596c08f423e3478aebc6205f3f5d8c',
            price: '0.42',
            type: 'buy',
            fullPrecisionAmount: '10',
            fullPrecisionPrice: '0.42',
            sharesEscrowed: '10',
            tokensEscrowed: '',
          },
          buyOrder2Id: {
            amount: '10',
            block: 1234,
            id: 'buyOrder2Id',
            market: 'testMarketId',
            outcome: '2',
            owner: '0x0000000000000000000000000000000000000001',
            price: '0.42',
            type: 'buy',
            fullPrecisionAmount: '10',
            fullPrecisionPrice: '0.42',
            sharesEscrowed: '0',
            tokensEscrowed: '4.2',
          },
        },
      },
      1: {
        buy: {
          buyOrder3Id: {
            amount: '10',
            block: 1234,
            id: 'buyOrder3Id',
            market: 'testMarketId',
            outcome: '1',
            owner: '0x0000000000000000000000000000000000000001',
            price: '0.42',
            type: 'buy',
            fullPrecisionAmount: '10',
            fullPrecisionPrice: '0.42',
            sharesEscrowed: '0',
            tokensEscrowed: '4.2',
          },
          buyOrder4Id: {
            amount: '10',
            block: 1234,
            id: 'buyOrder4Id',
            market: 'testMarketId',
            outcome: '1',
            owner: '0x0000000000000000000000000000000000000001',
            price: '0.44',
            type: 'buy',
            fullPrecisionAmount: '10',
            fullPrecisionPrice: '0.44',
            sharesEscrowed: '0',
            tokensEscrowed: '4.4',
          },
        },
        sell: {
          '0x8ef100c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb': {
            amount: '20',
            block: 1235,
            id: '0x8ef100c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb',
            market: 'testMarketId',
            outcome: '1',
            owner: '0x457435fbcd49475847f64898f933ffefc33388fc',
            price: '0.58',
            type: 'sell',
            fullPrecisionAmount: '20',
            fullPrecisionPrice: '0.58',
            sharesEscrowed: '20',
            tokensEscrowed: '0',
          },
          sellOrder2Id: {
            amount: '20',
            block: 1235,
            id: 'sellOrder2Id',
            market: 'testMarketId',
            outcome: '1',
            owner: '0x457435fbcd49475847f64898f933ffefc33388fc',
            price: '0.59',
            type: 'sell',
            fullPrecisionAmount: '20',
            fullPrecisionPrice: '0.59',
            sharesEscrowed: '0',
            tokensEscrowed: '8.2',
          },
        },
      },
    },
  },
  orderCancellation: {
    'an orderId': 'a status',
  },
  outcomesData: {
    testMarketId: {
      1: {
        id: '1',
        outstandingShares: '47',
        name: 'testOutcome',
        price: '0.5',
      },
      2: {
        id: '2',
        outstandingShares: '156',
        name: 'testOutcome 2',
        price: '0.5',
      },
    },
  },
  pagination: {
    numPerPage: 10,
    selectedPageNum: 1,
  },
  priceHistory: {
    testMarketId: {},
    '0xMARKET1': {
      0: [
        { amount: 10 },
        { amount: 20 },
      ],
      1: [
        { amount: 10 },
        { amount: 20 },
      ],
    },
    '0xMARKET2': {
      0: [
        { amount: 10 },
        { amount: 20 },
      ],
      1: [
        { amount: 10 },
        { amount: 20 },
      ],
    },
  },
  reports: {
    '0xf69b5': {
      testMarketId: {
        marketId: 'testMarketId',
        isScalar: false,
        isIndeterminate: false,
        isSubmitted: false,
      },
    },
  },
  selectedMarketId: 'testMarketId',
  selectedMarketsHeader: 'testMarketHeader',
  selectedFilterSort: {
    type: 'open',
    sort: 'volume',
    isDesc: true,
  },
  selectedTags: {
    testtag: {
      name: 'testtag',
    },
    tag: {
      name: 'tag',
    },
  },
  tradesInProgress: {
    testMarketId: {
      1: {
        numShares: 5000,
        limitPrice: '0.50',
        totalCost: '2500',
        type: 'yes/no ',
        side: BUY,
        sharesFilled: 5000,
      },
    },
  },
  transactionsData: {
    testtransaction12345: {
      id: 'testtransaction12345',
      message: 'CORS request rejected: https://faucet.augur.net/faucet/0x0000000000000000000000000000000000000001',
      status: 'failed',
      type: 'register',
      data: {},
    },
  },
  marketCreatorFees: {
    '0xMARKET1': 21,
  },
  allMarkets: [
    {
      id: '0xMARKET1',
      author: '0x0000000000000000000000000000000000000001',
      description: 'test-market-1',
      endTime: formatDate(new Date('2017/12/12')),
      volume: formatNumber(100),
      outcomes: [
        {
          orderBook: {
            bid: [
              {
                shares: formatShares(10),
              },
              {
                shares: formatShares(10),
              },
            ],
            ask: [
              {
                shares: formatShares(10),
              },
              {
                shares: formatShares(10),
              },
            ],
          },
        },
        {
          orderBook: {
            bid: [
              {
                shares: formatShares(10),
              },
              {
                shares: formatShares(10),
              },
            ],
            ask: [
              {
                shares: formatShares(10),
              },
              {
                shares: formatShares(10),
              },
            ],
          },
        },
      ],
    },
    {
      id: '0xMARKET2',
      author: '0x0000000000000000000000000000000000000001',
      description: 'test-market-2',
      endTime: formatDate(new Date('2017/12/12')),
      volume: formatNumber(100),
      outcomes: [
        {
          orderBook: {
            bid: [
              {
                shares: formatShares(10),
              },
              {
                shares: formatShares(10),
              },
            ],
            ask: [
              {
                shares: formatShares(10),
              },
              {
                shares: formatShares(10),
              },
            ],
          },
        },
        {
          orderBook: {
            bid: [
              {
                shares: formatShares(10),
              },
              {
                shares: formatShares(10),
              },
            ],
            ask: [
              {
                shares: formatShares(10),
              },
              {
                shares: formatShares(10),
              },
            ],
          },
        },
      ],
    },
    {
      id: '0xMARKET3',
      author: '0xtest456',
    },
    {
      id: '0xMARKET4',
      author: '0xtest456',
    },
  ],
}

export default testState
