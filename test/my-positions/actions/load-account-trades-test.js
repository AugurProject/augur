import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

import { UPDATE_ACCOUNT_TRADES_DATA } from '../../../src/modules/my-positions/actions/update-account-trades-data';

describe(`modules/my-positions/actions/load-account-trades.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState);
	const store = mockStore(state);
	// const testData = {
	// 	'0x5f28dc8c789626ff3fdc28509b7f25af5e53301de88356bce1e0ea5f406d4ad2': {
	// 		3: [{
	// 			type: 1,
	// 			price: '0.55',
	// 			shares: '222.043537948617376173',
	// 			trade_id: '0x0ba631b0ee824f668252128e6a2d4d554bcb284c77df39ab1fa2b60beaf88e62',
	// 			blockNumber: 1413814,
	// 			maker: false
	// 		}]
	// 	}
	// };

	const mockAugurJS = {
		loadAccountTrades: () => {}
	};
	// const mock = sinon.stub(mockAugurJS, 'loadAccountTrades', (loginID, cb) => cb(null, testData));

	const stubbedActions = {
		updateAccountTradesData: () => {}
	};
	const stubbedUpdateAccountTradesData = sinon.stub(stubbedActions, 'updateAccountTradesData', accountTrades => store.dispatch({ type: UPDATE_ACCOUNT_TRADES_DATA, data: accountTrades }));

	const action = proxyquire('../../../src/modules/my-positions/actions/load-account-trades', {
		'../../../modules/my-positions/actions/update-account-trades-data': stubbedUpdateAccountTradesData,
		'../../../services/augurjs': mockAugurJS
	});

	assert.isDefined(action); // TODO -- remove

	it('TODO -- should load trades from AugurJS for a given account id');

	// it(`should load trades from AugurJS for a given account id`, () => {
	// 	out = [{
	// 		type: 'UPDATE_ACCOUNT_TRADES_DATA',
	// 		data: {
	// 			'0x5f28dc8c789626ff3fdc28509b7f25af5e53301de88356bce1e0ea5f406d4ad2': {
	// 				'3': [{
	// 					'type': 1,
	// 					'price': '0.55',
	// 					'shares': '222.043537948617376173',
	// 					'trade_id': '0x0ba631b0ee824f668252128e6a2d4d554bcb284c77df39ab1fa2b60beaf88e62',
	// 					'blockNumber': 1413814,
	// 					'maker': false
	// 				}]
	// 			}
	// 		}
	// 	}];
	// 	store.dispatch(action.loadAccountTrades());
	// 	assert.includeDeepMembers(store.getActions(), out, `Didn't properly dispatch an UPDATE ACCOUNT TRADES DATA action`);
	// 	assert(mock.calledOnce, `Didn't call AugurJS.loadAccountTrades()`);
	// });
});
