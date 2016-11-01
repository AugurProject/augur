import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import assertions from 'augur-ui-react-components/lib/assertions';

let allMarkets;
describe(`modules/markets/selectors/markets-all.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, actual;
	let state = Object.assign({}, testState, {
		marketsData: {
			test: {
				endDate: new Date('01/01/3000'),
				outcomes: {
					test: {}
				},
				eventID: 'testEvent',
				volume: {
					value: 5
				}
			},
			test2: {
				endDate: new Date('01/01/3000'),
				outcomes: {
					test2: {}
				},
				eventID: 'testEvent2',
				volume: {
					value: 10
				}
			},
			test3: {
				endDate: new Date('01/01/3000'),
				outcomes: {
					test3: {}
				},
				eventID: 'testEvent3',
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
				id: 'testEvent'
			},
			testEvent2: {
				id: 'testEvent2'
			},
			testEvent3: {
				id: 'testEvent2'
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
	});
	store = mockStore(state);
	let mockMarket = {
		assembleMarket: () => {},
		selectMarketReport: () => {}
	};
	sinon.stub(mockMarket, 'assembleMarket', (marketID, market, priceHistory, isMarketOpen, favorite, outcomes, reports, accountTrades, tradesInProgress, endYear, endMonth, endDate, isBlockchainReportPhase, marketOrderBook, orderCancellation, loginAccount, dispatch) => {
		return market;
	});
	sinon.stub(mockMarket, 'selectMarketReport', (marketID, branchReports) => {
		return {};
	});

	selector = proxyquire('../../../src/modules/markets/selectors/markets-all.js', {
		'../../market/selectors/market': mockMarket,
		'../../../store': store
	});

	allMarkets = selector.default;

	it(`should return the correct selectedMarket function`, () => {
		actual = selector.default();

		assertions.markets(actual);
		assert(mockMarket.assembleMarket.calledThrice, `assembleMarket wasn't called 3 times as expected`);
	});
});

export default allMarkets;
