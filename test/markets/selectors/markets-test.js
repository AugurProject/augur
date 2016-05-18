import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/selectors/markets.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, out, test;
	let state = Object.assign({}, testState, {
		selectedMarketsHeader: 'pending_reports',
		pagination: {
			numPerPage: 5,
			selectedPageNum: 1
		}
	});
	store = mockStore(state);
	let mockMarkets = {
		selectFilteredMarkets: () => {}
	};
	let mockSelectors = {
		allMarkets: [{
			id: 'test1',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				qtyShares: {
					value: 5
				}
			},
			description: 'test 1',
			tags: ['testtag', 'test']
		}, {
			id: 'test2',
			isFavorite: false,
			isPendingReport: true,
			positionsSummary: {
				qtyShares: {
					value: 10
				}
			},
			description: 'test 2',
			tags: ['testtag', 'test']
		}, {
			id: 'test3',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				qtyShares: {
					value: 5
				}
			},
			description: 'test 3',
			tags: ['testtag', 'test']
		}, {
			id: 'test4',
			isFavorite: false,
			isPendingReport: true,
			description: 'test 4',
			tags: ['testtag', 'test']
		}, {
			id: 'test5',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				qtyShares: {
					value: 5
				}
			},
			description: 'test 5',
			tags: ['testtag', 'test']
		}, {
			id: 'test6',
			isFavorite: false,
			isPendingReport: true,
			positionsSummary: {
				qtyShares: {
					value: 10
				}
			},
			description: 'test 6',
			tags: ['testtag', 'test']
		}]
	};

	sinon.stub(mockMarkets, `selectFilteredMarkets`, (allMarkets, keywords, selectedFilters) => {
		return allMarkets
	});

	selector = proxyquire('../../../src/modules/markets/selectors/markets.js', {
		'../../../store': store,
		'../../markets/selectors/filtered-markets': mockMarkets,
		'../../../selectors': mockSelectors
	});

	it(`should select the proper page of markets`, () => {
		out = [{
			id: 'test1',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				qtyShares: {
					value: 5
				}
			},
			description: 'test 1',
			tags: ['testtag', 'test']
		}, {
			id: 'test2',
			isFavorite: false,
			isPendingReport: true,
			positionsSummary: {
				qtyShares: {
					value: 10
				}
			},
			description: 'test 2',
			tags: ['testtag', 'test']
		}, {
			id: 'test3',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				qtyShares: {
					value: 5
				}
			},
			description: 'test 3',
			tags: ['testtag', 'test']
		}, {
			id: 'test4',
			isFavorite: false,
			isPendingReport: true,
			description: 'test 4',
			tags: ['testtag', 'test']
		}, {
			id: 'test5',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				qtyShares: {
					value: 5
				}
			},
			description: 'test 5',
			tags: ['testtag', 'test']
		}];

		test = selector.default();
		assert.deepEqual(test, out, `Didn't return the expected markets`);
		assert(mockMarkets.selectFilteredMarkets.calledOnce, `selectFilteredMarkets wasn't called once as expected`);
	});

	it(`should return markets with positions`, () => {
		state.activePage = 'positions';
		test = selector.default();
		out = mockSelectors.allMarkets.slice(0, 3)
			.concat(mockSelectors.allMarkets.slice(4));

		assert.deepEqual(test, out, `Didn't return all markets with positions as expected`);
	});

	it(`should return markets pending reports`, () => {
		state.activePage = testState.activePage;
		state.selectedMarketsHeader = 'pending reports';
		test = selector.default();
		out = mockSelectors.allMarkets.filter(market => market.isPendingReport);

		assert.deepEqual(test, out, `Didn't return only markets that are pending reports`);
	});

	it(`should return favorite markets`, () => {
		state.selectedMarketsHeader = 'favorites';
		test = selector.default();
		out = mockSelectors.allMarkets.filter(market => market.isFavorite);

		assert.deepEqual(test, out, `Didn't return only favorite markets as expected`);
	});
});
