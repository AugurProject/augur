// Generic starting test state.
// Goal: To help keep these unit tests as DRY as possible.
import env from '../src/env.json';

const testState = {
	activePage: 'markets',
	accountTrades: {
		testMarketID: {}
	},
	auth: {
		err: null,
		selectedAuthType: 'register'
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
	env,
	loginAccount: {
		address: '0xtest123',
		id: '0xtest123',
		name: 'testTesterson',
		secureLoginID: 'testSecureID',
		localNode: false,
		prettyAddress: '0xte...t123',
		linkText: 'testTesterson',
		prettySecureLoginID: 'test...reID',
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
			orderBook: {} // todo: delete when AURC > v3.0.20 - assertion will be fixed there
		}
	},
	marketOrderBooks: {
		testMarketID: {
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
				'order2': {
					amount: '10',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0xtest123',
					price: '0.42',
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
				}
			}
		}
	},
	outcomes: {
		testMarketID: {
			'2': {
				id: '2',
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
