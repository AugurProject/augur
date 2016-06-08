import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
// import * as selector from '../../../src/modules/market/selectors/price-time-series';

describe(`modules/market/selectors/price-time-series.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, expected, actual;
	let state = Object.assign({}, testState);
	let mockDate = {};
	store = mockStore(state);
	mockDate.blockToDate = sinon.stub().returns('SomeDate');

	selector = proxyquire('../../../src/modules/market/selectors/price-time-series.js', {
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
		actual = selector.selectPriceTimeSeries(outcomes, priceHistory);
		expected = [{
			name: 'test',
			data: [
				[`SomeDate`, 100]
			]
		}];
		assert(mockDate.blockToDate.calledOnce, `Didn't call blockToDate once as expected`);
		assert.deepEqual(actual, expected, `Didn't produce the expected output`);
	});
});
