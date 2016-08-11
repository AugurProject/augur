import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/market/actions/load-price-history.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockAugurJS = { augur: {} };
	mockAugurJS.augur.getMarketPriceHistory = sinon.stub();


	action = proxyquire('../../../src/modules/market/actions/load-price-history', {
		'../../../services/augurjs': mockAugurJS
	});

	it(`should call AugurJS getMarketPriceHistory`, () => {
		store.dispatch(action.loadPriceHistory('test'));
		assert(mockAugurJS.augur.getMarketPriceHistory.calledOnce);
	});
});
