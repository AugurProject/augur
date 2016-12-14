import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/markets/selectors/markets.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let test;

	const state = Object.assign({}, testState, {
		selectedMarketsHeader: 'pending reports',
		pagination: {
			numPerPage: 5,
			selectedPageNum: 1
		}
	});
	const store = mockStore(state);
	const mockSelectors = {
		unpaginatedMarkets: [{
			id: 'test1',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				qtyShares: {
					value: 5
				}
			},
			description: 'test 1',
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
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
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
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
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
		}, {
			id: 'test4',
			isFavorite: false,
			isPendingReport: true,
			description: 'test 4',
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
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
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
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
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
		}]
	};

	const selector = proxyquire('../../../src/modules/markets/selectors/markets.js', {
		'../../../store': store,
		'../../../selectors': mockSelectors
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should return unpaginatedMarkets if selectedMarketsHeader is PENDING_REPORTS`, () => {
		test = selector.default();
		assert.deepEqual(test, mockSelectors.unpaginatedMarkets, `Didn't return the expected markets`);
	});

	it(`should return unpaginatedMarkets if activePage is POSITIONS`, () => {
		state.activePage = 'positions';
		test = selector.default();
		assert.deepEqual(test, mockSelectors.unpaginatedMarkets, `Didn't return all markets with positions as expected`);
	});

	it(`should return paginated markets`, () => {
		state.activePage = testState.activePage;
		state.selectedMarketsHeader = 'test';
		test = selector.default();
		const out = [{
			id: 'test1',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				qtyShares: {
					value: 5
				}
			},
			description: 'test 1',
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
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
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
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
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
		}, {
			id: 'test4',
			isFavorite: false,
			isPendingReport: true,
			description: 'test 4',
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
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
			tags: ['testtag', 'test'],
			isLoadedMarketInfo: true
		}];

		assert.deepEqual(test, out, `Didn't return only markets that are pending reports`);
	});
});
