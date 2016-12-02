import { describe, it, beforeEach, afterEach } from 'mocha';
import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';

describe(`modules/market/selectors/price-time-series.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	// const middlewares = [thunk];
	// const mockStore = configureMockStore(middlewares);
	const { store } = mockStore.default;
	// let state = Object.assign({}, testState);
	const mockDate = {};
	// store = mockStore(state);
	mockDate.blockToDate = sinon.stub().returns(new Date(Date.UTC(2017, 0, 1)));

	const selector = proxyquire('../../../src/modules/market/selectors/price-time-series.js', {
		'../../../store': store,
		'../../../utils/date-to-block-to-date': mockDate
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
				blockNumber: 1
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
		assert(mockDate.blockToDate.calledOnce, `Didn't call blockToDate once as expected`);
		assert.deepEqual(actual, expected, `Didn't produce the expected output`);
	});
});
