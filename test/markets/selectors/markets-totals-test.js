import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
import { assertions } from 'augur-ui-react-components';

let marketsTotals;
describe(`modules/markets/selectors/markets-totals.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, expected, actual;
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
	});

	marketsTotals = selector.default;

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should return the market totals for selected market`, () => {
		actual = selector.default();
		assertions.marketsTotals(actual);
	});
});

export default marketsTotals;
