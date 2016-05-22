import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/market/actions/load-basic-market.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockAugurJS = {};
	let mockParse = {};
	mockAugurJS.loadMarket = sinon.stub().yields(null, {
		_id: 'test1',
		data: 'testing123'
	});
	mockParse.parseMarketsData = sinon.stub().returnsArg(0);

	action = proxyquire('../../../src/modules/market/actions/load-basic-market.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../../utils/parse-market-data': mockParse
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
			test1: {
				_id: 'test1',
				data: 'testing123'
			}
		}, {
			type: 'TEST_CALLBACK'
		}];

		store.dispatch(action.loadBasicMarket('test1', cb));

		assert(mockAugurJS.loadMarket.calledOnce, `AugurJS.loadMarket wasn't called only once as expected`);
		assert(mockParse.parseMarketsData.calledOnce, `ParseMarketsData wasn't called only once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});

});
