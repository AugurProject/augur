import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';

describe(`modules/my-positions/selectors/my-positions.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const mockSelectors = {
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

	const selector = proxyquire('../../../src/modules/my-positions/selectors/my-positions.js', {
		'../../../selectors': mockSelectors
	});

	it(`should return only positions markets`, () => {
		const test = selector.default();
		const out = mockSelectors.positionsMarkets.filter(market => market.positionsSummary && market.positionsSummary.numPositions && market.positionsSummary.numPositions.value);

		assert.deepEqual(test, out, `Didn't return the expected markets`);
	});
});
