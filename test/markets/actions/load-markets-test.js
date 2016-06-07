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
	let mockLoadMarketsInfo = { loadMarketsInfo: () => {} };

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

	sinon.stub(mockLoadMarketsInfo, `loadMarketsInfo`, (marketsDataKeys) => {
		return {
			type: 'LOAD_MARKETS_INFO',
			marketsInfo: {...marketsDataKeys}
		};
	});

	action = proxyquire('../../../src/modules/markets/actions/load-markets', {
		'../../../services/augurjs': mockAugurJS,
		'../../markets/actions/load-markets-info': mockLoadMarketsInfo
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
		}, {
			marketsInfo: {
				'0': 'marketsData'
			},
			type: 'LOAD_MARKETS_INFO'
		}];

		store.dispatch(action.loadMarkets());

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions`);
		assert(mockAugurJS.loadMarkets.calledOnce, `AugurJS.loadMarkets() wasn't called once`);
	});

});
