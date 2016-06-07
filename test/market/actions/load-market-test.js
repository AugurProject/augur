import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/market/actions/load-market.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockAugurJS = {};
	mockAugurJS.loadMarket = sinon.stub().yields(null, {
		_id: 'test1',
		data: 'testing123'
	});

	action = proxyquire('../../../src/modules/market/actions/load-market.js', {
		'../../../services/augurjs': mockAugurJS
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should load a basic market`, () => {
		let cb = () => store.dispatch({
			type: 'TEST_CALLBACK'
		});

		out = [{
			type: 'UPDATE_MARKETS_DATA',
			marketsData: {
				test1: {
					_id: 'test1',
					data: 'testing123'
				}
			}
		}, {
			type: 'TEST_CALLBACK'
		}];

		store.dispatch(action.loadMarket('test1', cb));

		assert(mockAugurJS.loadMarket.calledOnce, `AugurJS.loadMarket wasn't called only once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});

});
