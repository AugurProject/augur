import { describe, it, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import mocks from 'test/mockStore';
import { CANCELLING } from 'modules/bids-asks/constants/order-status';
import { BID } from 'modules/bids-asks/constants/bids-asks-types';

describe('modules/bids-asks/actions/update-order-status.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const store = mocks.mockStore(mocks.state);
	const updateOrderModule = proxyquire('../../../src/modules/bids-asks/actions/update-order-status', {
		'../../../store': store
	});

	afterEach(() => {
		store.clearActions();
	});

	describe('updateOrderStatus', () => {
		it(`shouldn't dispatch if order cannot be found`, () => {
			store.dispatch(updateOrderModule.updateOrderStatus('nonExistingOrderID', CANCELLING, 'marketID', BID));
			assert.lengthOf(store.getActions(), 0);

			store.dispatch(updateOrderModule.updateOrderStatus('orderID', CANCELLING, 'nonExistingMarketID', BID));
			assert.lengthOf(store.getActions(), 0);
		});

		it(`should dispatch action`, () => {
			store.dispatch(updateOrderModule.updateOrderStatus('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', CANCELLING, 'testMarketID', BID));

			assert.deepEqual(store.getActions(), [{
				type: updateOrderModule.UPDATE_ORDER_STATUS,
				orderID: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
				status: CANCELLING,
				marketID: 'testMarketID',
				orderType: BID
			}]);
		});
	});
});
