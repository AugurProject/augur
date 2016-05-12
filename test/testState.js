// Generic starting test state.
// Goal: To help keep these unit tests as DRY as possible.
const testState = {
  accountTrades: {},
  auth: {
    err: null,
    selectedAuthType: 'register'
  },
  bidsAsks: {
    testMarketID: {
      id: 'test',
      testOutcomeID: {
        ask: {
          3: {
            '0xtest123': 500
          }
        },
        bid: {
          5: {
            '0xtest123': 1000
          }
        }
      }
    }
  },
  blockchain: {
    currentBlockMillisSinceEpoch: 1461774253983,
    currentBlockNumber: 833339,
    currentPeriod: 20,
    isReportConfirmationPhase: true,
    reportPeriod: 19
  },
  branch: {
    description: 'root branch',
    periodLength: 4000
  },
  createMarketInProgress: {},
  favorites: {},
  loginAccount: {
    address: '0xtest123',
    id: '0xtest123',
    handle: 'testTesterson',
    ether: 0,
    realEther: 0,
    rep: 0,
    keystore: {
      id: '0xtest123'
    }
  },
  keywords: '',
  marketsData: {},
  outcomes: { testMarketID: { id: 'testMarketID'}, test: {id: 'test'} },
  pagination: {
    numPerPage: 10,
    selectedPageNum: 1
  },
  reports: {},
  selectedFilters: {
    isOpen: true
  },
  selectedMarketId: null,
  selectedMarketsHeader: null,
  selectedSort: {
    isDesc: true,
    prop: 'volume'
  },
  tradesInProgress: {},
  transactionsData: {
    testtransaction12345: {
      id: 'testtransaction12345',
      message: 'CORS request rejected: https://faucet.augur.net/faucet/0xtest123',
      status: 'failed',
      type: 'register'
    }
  }
};

export default testState;
