import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/actions/load-markets.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockAugurJS = {};

	mockAugurJS.loadNumMarkets = sinon.stub();
	mockAugurJS.loadMarkets = sinon.stub();
	mockAugurJS.loadNumMarkets.yields(null, 1);
	mockAugurJS.loadMarkets.yields(null, {
		marketsData: {
			_id: 'test',
			test: 'info',
			example: 'test info'
		}
	});

	action = proxyquire('../../../src/modules/markets/actions/load-markets', {
		'../../../services/augurjs': mockAugurJS
	});

	it(`should load markets properly`, () => {
		out = [{
			type: 'UPDATE_MARKETS_DATA',
			marketsData: {
				marketsData: {
					_id: 'test',
					test: 'info',
					example: 'test info'
				}
			}
		}];

		store.dispatch(action.loadMarkets(1010101));

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions`);
		assert(mockAugurJS.loadMarkets.calledOnce, `AugurJS.loadMarkets() wasn't called once`);
	});

});
