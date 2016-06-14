import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import * as assertions from '../../../node_modules/augur-ui-react-components/test/assertions/market';

let market;
describe(`modules/market/selectors/market.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, expected, actual;
	let state = Object.assign({}, testState, {
		selectedMarketID: 'testMarketID',
		marketsData: {
			testMarketID: {
				eventID: 'testEventID',
				name: 'testMarket',
				description: 'some test description',
				endDate: 123,
				type: 'scalar',
				tradingFee: 5,
				volume: 500,
				tags: ['tag1', 'tag2', 'tag3']
			}
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
		priceHistory: {
			testMarketID: {}
		},
		reports: {
			testEventID: { isUnethical: false }
		},
		accountTrades: {
			testMarketID: {}
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
		marketOrderBooks: {},
		favorites: {
			testMarketID: true
		}
	});
	store = mockStore(state);
	let mockFavorites = {
		toggleFavorite: () => {}
	};
	let mockPlaceTrade = {
		placeTrade: () => {}
	};
	let mockTradesInProgress = {
		updateTradesInProgress: () => {}
	};
	let mockSubmitReport = {
		submitReport: () => {}
	};
	let mockLinks = {
		selectMarketLink: () => {}
	};
	let mockTradeOrders = {
		selectOutcomeTradeOrders: () => {}
	};
	let mockTradeSummary = {
		selectTradeSummary: () => {}
	};
	let mockPosSummary = {
		selectPositionsSummary: () => {}
	};
	let mockPriceTime = {
		selectPriceTimeSeries: () => {}
	};
	let mockPosition = {
		selectPositionFromOutcomeAccountTrades: () => {}
	};

	sinon.stub(mockFavorites, `toggleFavorite`, (marketID) => {
		return {
			type: 'TOGGLE_FAVORITE',
			marketID
		}
	});
	sinon.stub(mockPlaceTrade, `placeTrade`, (marketID) => {
		return {
			type: 'PLACE_TRADE',
			marketID
		}
	});
	sinon.stub(mockTradesInProgress, `updateTradesInProgress`, (marketID, outcomeID, numShares, limitPrice) => {
		return {
			type: 'UPDATE_TRADE_IN_PROGRESS',
			marketID,
			outcomeID
		}
	});
	sinon.stub(mockSubmitReport, `submitReport`, () => 'submitReportHit');
	sinon.stub(mockLinks, `selectMarketLink`, () => {
		let obj = {
			text: 'testMarketLink',
			className: 'testMarketLink',
			onClick: () => true
		};
		return obj;
	});
	sinon.stub(mockTradeOrders, 'selectOutcomeTradeOrders', (o, outcome, outcomeTradeInProgress, dispatch) => {
		return 'selectOutcomeTradeOrdersHit';
	});
	sinon.stub(mockTradeSummary, `selectTradeSummary`, () => {
		let obj = {
			text: 'trade summary'
		};
		return obj;
	});
	sinon.stub(mockPosSummary, `selectPositionsSummary`, (listLength, qtyShares, totalValue, totalCost) => {
		let obj = {text: 'selectPositionsSummaryHit'};
		return obj;
	});
	sinon.stub(mockPriceTime, `selectPriceTimeSeries`, () => {
		let obj = ['price', 'time', 'series'];
		return obj;
	});
	sinon.stub(mockPosition, `selectPositionFromOutcomeAccountTrades`, () => 'selectPositionFromOutcomeAccountTradesHit');

	selector = proxyquire('../../../src/modules/market/selectors/market.js', {
		'../../../store': store,
		'../../markets/actions/update-favorites': mockFavorites,
		'../../trade/actions/place-trade': mockPlaceTrade,
		'../../trade/actions/update-trades-in-progress': mockTradesInProgress,
		'../../reports/actions/submit-report': mockSubmitReport,
		'../../link/selectors/links': mockLinks,
		'../../trade/selectors/trade-orders': mockTradeOrders,
		'../../trade/selectors/trade-summary': mockTradeSummary,
		'../../positions/selectors/positions-summary': mockPosSummary,
		'../../market/selectors/price-time-series': mockPriceTime,
		'../../positions/selectors/position': mockPosition
	});

	market = selector.default;

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should return an assembled market`, () => {
		actual = selector.default();
		assertions.marketAssertion(actual);
		assertions.tradingFeePercentAssertion(actual.tradingFeePercent);
		assertions.volumeAssertion(actual.volume);
		assertions.reportAssertion(actual.report);
		assertions.marketLinkAssertion(actual.marketLink);
		// expected = {
		// 	eventID: 'testEventID',
		// 	name: 'testMarket',
		// 	description: 'some test description',
		// 	endDate: 0,
		// 	type: 'scalar',
		// 	tradingFee: 5,
		// 	volume: {
		// 		value: 500,
		// 		formattedValue: 500,
		// 		formatted: '500',
		// 		roundedValue: 500,
		// 		rounded: '500',
		// 		minimized: '500',
		// 		denomination: '',
		// 		full: '500'
		// 	},
		// 	tags: [{
		// 		name: 'tag1',
		// 		onClick: actual.tags[0].onClick
		// 	}, {
		// 		name: 'tag2',
		// 		onClick: actual.tags[1].onClick
		// 	}, {
		// 		name: 'tag3',
		// 		onClick: actual.tags[2].onClick
		// 	}],
		// 	id: 'testMarketID',
		// 	isBinary: false,
		// 	isCategorical: false,
		// 	isScalar: true,
		// 	endDate: {
		// 		formatted: 'Jan 1, 3000',
		// 		full: new Date(3000, 0, 1, 0, 0, 0, 0).toISOString(),
		// 		value: new Date(3000, 0, 1, 0, 0, 0, 0)
		// 	},
		// 	isOpen: false,
		// 	isExpired: true,
		// 	isFavorite: true,
		// 	tradingFeePercent: {
		// 		value: 500,
		// 		formattedValue: 500,
		// 		formatted: '500.0',
		// 		roundedValue: 500,
		// 		rounded: '500',
		// 		minimized: '500',
		// 		denomination: '%',
		// 		full: '500.0%'
		// 	},
		// 	isRequiredToReportByAccount: true,
		// 	isPendingReport: false,
		// 	isReportSubmitted: false,
		// 	isReported: false,
		// 	isMissedReport: true,
		// 	isMissedOrReported: true,
		// 	marketLink: 'selectMarketLinkHit',
		// 	onClickToggleFavorite: actual.onClickToggleFavorite,
		// 	onSubmitPlaceTrade: actual.onSubmitPlaceTrade,
		// 	report: {
		// 		onSubmitReport: actual.report.onSubmitReport
		// 	},
		// 	outcomes: [{
		// 		id: 'testMarketID',
		// 		name: 'testOutcome',
		// 		price: 50,
		// 		marketID: 'testMarketID',
		// 		lastPrice: {
		// 			value: 50,
		// 			formattedValue: 50,
		// 			formatted: '50.00',
		// 			roundedValue: 50,
		// 			rounded: '50.0',
		// 			minimized: '50',
		// 			denomination: 'Eth',
		// 			full: '50.00Eth'
		// 		},
		// 		lastPricePercent: {
		// 			value: 5000,
		// 			formattedValue: 5000,
		// 			formatted: '5,000.0',
		// 			roundedValue: 5000,
		// 			rounded: '5,000',
		// 			minimized: '5,000',
		// 			denomination: '%',
		// 			full: '5,000.0%'
		// 		},
		// 		trade: {
		// 			numShares: 5000,
		// 			limitPrice: 100,
		// 			tradeSummary: 'selectTradeSummaryHit',
		// 			onChangeTrade: actual.outcomes[0].trade.onChangeTrade
		// 		}
		// 	}],
		// 	priceTimeSeries: 'selectPriceTimeSeriesHit',
		// 	reportableOutcomes: [{
		// 		id: 'testMarketID',
		// 		name: 'testOutcome',
		// 		price: 50,
		// 		marketID: 'testMarketID',
		// 		lastPrice: {
		// 			value: 50,
		// 			formattedValue: 50,
		// 			formatted: '50.00',
		// 			roundedValue: 50,
		// 			rounded: '50.0',
		// 			minimized: '50',
		// 			denomination: 'Eth',
		// 			full: '50.00Eth'
		// 		},
		// 		lastPricePercent: {
		// 			value: 5000,
		// 			formattedValue: 5000,
		// 			formatted: '5,000.0',
		// 			roundedValue: 5000,
		// 			rounded: '5,000',
		// 			minimized: '5,000',
		// 			denomination: '%',
		// 			full: '5,000.0%'
		// 		},
		// 		trade: {
		// 			numShares: 5000,
		// 			limitPrice: 100,
		// 			tradeSummary: 'selectTradeSummaryHit',
		// 			onChangeTrade: actual.reportableOutcomes[0].trade.onChangeTrade
		// 		}
		// 	}, {
		// 		id: '1.5',
		// 		name: 'indeterminate'
		// 	}],
		// 	tradeSummary: 'selectTradeSummaryHit',
		// 	positionsSummary: 'selectPositionsSummaryHit',
		// 	positionOutcomes: []
		// };
		//
		// assert(mockLinks.selectMarketLink.calledOnce, `Didn't call selectMarketLink once as expected`);
		// assert(mockTradeOrders.selectOutcomeTradeOrders.calledOnce, `Didn't call selectOutcomeTradeOrders once as expected`);
		// assert(mockTradeSummary.selectTradeSummary.calledTwice, `Didn't call selectTradeSummary twice as expected`);
		// assert(mockPosSummary.selectPositionsSummary.calledOnce, `Didn't call selectPositionsSummary once as expected`);
		// assert(mockPriceTime.selectPriceTimeSeries.calledOnce, `Didn't call selectPriceTimeSeries once as expected`);
		// assert.deepEqual(actual, expected, `Didn't produce the expected object`);
	});
});

export default market;
