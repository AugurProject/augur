import { assert } from 'chai';
import orderCancellationReducer from '../../../src/modules/bids-asks/reducers/order-cancellation'
import { ABORT_CANCEL_ORDER_CONFIRMATION, SHOW_CANCEL_ORDER_CONFIRMATION } from '../../../src/modules/bids-asks/actions/cancel-order';
import { UPDATE_ORDER_STATUS } from '../../../src/modules/bids-asks/actions/update-order-status';
import { CANCELLATION_CONFIRMATION } from '../../../src/modules/bids-asks/constants/order-status';

describe('modules/bids-asks/reducers/order-cancellation.js', () => {
	it('should react to UPDATE_ORDER_STATUS action', () => {
		const currentState = {};

		const newState = orderCancellationReducer(currentState, {
			type: UPDATE_ORDER_STATUS,
			orderID: 'an orderID',
			status: 'a status'
		});

		assert.deepEqual(newState, { 'an orderID': 'a status' });
		assert.notStrictEqual(currentState, newState);
	});

	it('should react to SHOW_CANCEL_ORDER_CONFIRMATION action', () => {
		const currentState = {};

		const newState = orderCancellationReducer(currentState, {
			type: SHOW_CANCEL_ORDER_CONFIRMATION,
			orderID: 'an orderID'
		});

		assert.deepEqual(newState, { 'an orderID': CANCELLATION_CONFIRMATION });
		assert.notStrictEqual(currentState, newState);
	});

	it('should react to ABORT_CANCEL_ORDER_CONFIRMATION action', () => {
		const currentState = { 'an orderID': CANCELLATION_CONFIRMATION, 'another orderID': 'another status' };

		const newState = orderCancellationReducer(currentState, {
			type: ABORT_CANCEL_ORDER_CONFIRMATION,
			orderID: 'an orderID'
		});

		assert.deepEqual(newState, { 'another orderID': 'another status' });
		assert.notStrictEqual(currentState, newState);
	});
});
