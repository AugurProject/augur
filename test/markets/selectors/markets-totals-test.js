import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import testState from '../../testState';
import * as mockStore from '../../mockStore';
import * as assertions from '../../../node_modules/augur-ui-react-components/test/assertions/marketsTotals';

let marketsTotals;

describe(`modules/markets/selectors/markets-totals.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	// const middlewares = [thunk];
	// const mockStore = configureMockStore(middlewares);
	let selector, out, test;
	// let state = Object.assign({}, testState);
	// store = mockStore(state);
	let { state, store } = mockStore.default;
	let mockPositions = {
		selectPositionsSummary: () => {}
	};
	let mockSelectors = {
		allMarkets: [{
			id: 'test1',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				numPositions: {
					value: 5
				},
				totalValue: {
					value: 10
				},
				totalCost: {
					value: 100
				},
				qtyShares: {
					value: 5
				}
			},
			description: 'test 1',
			tags: [{name: 'testtag'}, {name: 'test'}]
		}, {
			id: 'test2',
			isFavorite: false,
			isPendingReport: true,
			positionsSummary: {
				numPositions: {
					value: 3
				},
				totalValue: {
					value: 6
				},
				totalCost: {
					value: 9
				},
				qtyShares: {
					value: 10
				}
			},
			description: 'test 2',
			tags: [{name: 'testtag'}, {name: 'test'}]
		}, {
			id: 'test3',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				numPositions: {
					value: 2
				},
				totalValue: {
					value: 4
				},
				totalCost: {
					value: 8
				},
				qtyShares: {
					value: 5
				}
			},
			description: 'test 3',
			tags: [{name: 'testtag'}, {name: 'test'}, {name: 'test2'}]
		}, {
			id: 'test4',
			isFavorite: false,
			isPendingReport: true,
			description: 'test 4',
			tags: [{name: 'testtag'}, {name: 'test'}]
		}, {
			id: 'test5',
			isFavorite: true,
			isPendingReport: false,
			positionsSummary: {
				numPositions: {
					value: 10
				},
				totalValue: {
					value: 20
				},
				totalCost: {
					value: 30
				},
				qtyShares: {
					value: 5
				}
			},
			description: 'test 5',
			tags: [{name: 'testtag'}, {name: 'test1'}]
		}, {
			id: 'test6',
			isFavorite: false,
			isPendingReport: true,
			positionsSummary: {
				numPositions: {
					value: 50
				},
				totalValue: {
					value: 100
				},
				totalCost: {
					value: 150
				},
				qtyShares: {
					value: 10
				}
			},
			description: 'test 6',
			tags: [{name: 'testtag'}, {name: 'test'}]
		}],
		filteredMarkets: '7length',
		unpaginatedMarkets: 'testing',
		favoriteMarkets: 'test'
	};

	sinon.stub(mockPositions, 'selectPositionsSummary', (numPositions, qtyShares, totalValue, totalCost) => {
		return {
			numPositions,
			qtyShares,
			totalValue,
			totalCost
		};
	});

	selector = proxyquire('../../../src/modules/markets/selectors/markets-totals.js', {
		'../../../store': store,
		'../../../selectors': mockSelectors,
		// '../../positions/selectors/positions-summary': mockPositions
	});

	marketsTotals = selector.default;

	it(`should return the market totals for selected market`, () => {
		test = selector.default();
		out = {
			numAll: 6,
			numFavorites: 4,
			numPendingReports: 3,
			numUnpaginated: 7,
			numFiltered: 7,
			positionsSummary: {
				numPositions: 70,
				qtyShares: 35,
				totalValue: 140,
				totalCost: 297
			}
		};
		assertions.marketsTotalsAssertion(test);

		// assert(mockPositions.selectPositionsSummary.calledOnce, `Didn't selectPositionsSummary call once as expected`);

		// assert.deepEqual(test, out, `Didn't output the expected Totals`);
	});
});

export default marketsTotals;
