// Generic starting test state.
// Goal: To help keep these unit tests as DRY as possible.
const testState = {
	accountTrades: {},
	activePage: 'markets',
	accountTrades: {
		testMarketID: {}
	},
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
	connection: {
		isConnected: true
	},
	createMarketInProgress: {},
	favorites: {
		testMarketID: true
	},
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
	keywords: 'test testtag',
	marketsData: {
		testMarketID: {
			eventID: 'testEventID',
			name: 'testMarket',
			description: 'some test description',
			endDate: 123,
			type: 'scalar',
			makerFee: 0.02,
			takerFee: 0.05,
			volume: 500,
			tags: ['tag1', 'tag2', 'tag3'],
			orderBook: {}
		}
	},
	marketOrderBooks: {
		testMarketID: {}
	},
	outcomes: {
		testMarketID: {
			testMarketID: {
				id: 'testMarketID',
				name: 'testOutcome',
				price: 50
			}
		}
	},
	pagination: {
		numPerPage: 10,
		selectedPageNum: 1
	},
	priceHistory: {
		testMarketID: {}
	},
	reports: {
		testEventID: {
			isUnethical: false
		}
	},
	selectedFilters: {
		isOpen: true
	},
	selectedMarketID: 'testMarketID',
	selectedMarketsHeader: 'testMarketHeader',
	selectedSort: {
		isDesc: true,
		prop: 'volume'
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
			testMarketID: {
				numShares: 5000,
				limitPrice: 100,
				totalCost: 50
			}
		}
	},
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
