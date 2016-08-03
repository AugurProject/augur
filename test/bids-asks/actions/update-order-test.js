/*
 * Author: priecint
 */
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import mocks from '../../mockStore';
import { CANCELLING } from '../../../src/modules/bids-asks/constants/order-status';
import { BID } from '../../../src/modules/bids-asks/constants/bids-asks-types';


describe('modules/bids-asks/actions/update-order.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const store = mocks.mockStore(mocks.state);
	const dispatch = sinon.stub(store, 'dispatch');
	const updateOrderModule = proxyquire('../../../src/modules/bids-asks/actions/update-order', {
		'../../../store': store
	});

	afterEach(() => {
		dispatch.reset();
		store.clearActions();
	});

	describe('updateOrderStatus', () => {
		it(`shouldn't dispatch if order cannot be found`, () => {
			dispatch(updateOrderModule.updateOrderStatus('nonExistingOrderID', CANCELLING, 'marketID', BID));
			assert.strictEqual(dispatch.callCount, 1);

			dispatch(updateOrderModule.updateOrderStatus('orderID', CANCELLING, 'nonExistingMarketID', BID));
			assert.strictEqual(dispatch.callCount, 2);
		});

		it(`should dispatch action`, () => {
			dispatch(updateOrderModule.updateOrderStatus('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', CANCELLING, 'testMarketID', BID));
			assert.isTrue(dispatch.calledOnce);
			assert.deepEqual(dispatch.args[0], [{
				type: updateOrderModule.UPDATE_ORDER_STATUS,
				orderID: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
				status: CANCELLING,
				marketID: 'testMarketID',
				orderType: 'buy'
			}]);
		});
	});
});
