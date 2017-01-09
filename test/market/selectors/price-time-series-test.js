import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from 'test/mockStore';

describe(`modules/market/selectors/price-time-series.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const { store } = mockStore.default;
	const selector = proxyquire('../../../src/modules/market/selectors/price-time-series.js', {
		'../../../store': store
	});
	beforeEach(() => {
		store.clearActions();
	});
	afterEach(() => {
		store.clearActions();
	});
	it(`should select Price Time Series`, () => {
		const priceHistory = {
			testID: [{
				price: 100,
				timestamp: 1483228800
			}]
		};
		const outcomes = [{
			name: 'test',
			id: 'testID'
		}];
		const actual = selector.selectPriceTimeSeries(outcomes, priceHistory);
		const expected = [{
			name: 'test',
			data: [
				[1483228800000, 100]
			]
		}];
		assert.deepEqual(actual, expected, `Didn't produce the expected output`);
	});
});
