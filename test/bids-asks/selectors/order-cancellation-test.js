import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import mocks from '../../mockStore';
import { CANCELLATION_CONFIRMATION, CANCELLATION_FAILED, CANCELLED, CANCELLING } from '../../../src/modules/bids-asks/constants/order-status';

describe('modules/bids-asks/selectors/order-cancellation.js', () => {
	proxyquire.noPreserveCache().noCallThru();

	const { store } = mocks;
	const orderCancellationSelector = proxyquire('../../../src/modules/bids-asks/selectors/order-cancellation', {
		'../../../store': store
	}).default;

	it('should select correct values', () => {
		const orderCancellation = orderCancellationSelector();
		assert.isFunction(orderCancellation.abortCancelOrderConfirmation);
		assert.isFunction(orderCancellation.showCancelOrderConfirmation);
		assert.isFunction(orderCancellation.abortCancelOrderConfirmation);
		assert.deepEqual(orderCancellation.cancellationStatuses, {
			CANCELLATION_CONFIRMATION, CANCELLATION_FAILED, CANCELLED, CANCELLING
		});
		assert.propertyVal(orderCancellation, 'an orderID', 'a status');
		assert.lengthOf(Object.keys(orderCancellation), 5);
	});
});
