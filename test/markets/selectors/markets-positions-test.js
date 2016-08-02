import { assert } from 'chai';
import proxyquire from 'proxyquire';

let positionsMarkets;
describe(`modules/markets/selectors/markets-positions.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, out, test;
	let mockSelectors = {
		positionsMarkets: [{
			id: 'test1',
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
			isPendingReport: true,
			description: 'test 4',
			tags: ['testtag', 'test']
		}, {
			id: 'test5',
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

	selector = proxyquire('../../../src/modules/markets/selectors/markets-positions.js', {
		'../../../selectors': mockSelectors
	});

	positionsMarkets = selector.default;

	it(`should return only positions markets`, () => {
		test = selector.default();
		out = mockSelectors.allMarkets.filter(market => market.positionsSummary);
		assert.deepEqual(test, out, `Didn't return the expected markets`);
	});
});

export default positionsMarkets;
