import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import realSelector from '../../../src/modules/trade/selectors/trade-in-progress';

describe(`modules/trade/selectors/trade-in-progress.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const testState = {
		selectedMarketID: 'testmarket',
		tradesInProgress: {
			'testmarket': 'this is a test'
		}
	};
	let selector, store;
	store = mockStore(testState);

	selector = proxyquire('../../../src/modules/trade/selectors/trade-in-progress', {
		'../../../store': store
	});

	it(`should return tradesInProgress[selectedMarketID] if available`, () => {
		assert.equal(selector.default(), 'this is a test', `selector.default() is not 'this is a test'`);
	});

	it(`should return undefined if tradesInProgress[selectedMarketID] doesn't exist`, () => {
		assert.isUndefined(realSelector(), `isn't undefined as expected with blank state`);
	});
});
