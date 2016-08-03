/*
 * Author: priecint
 */

import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import mocks from '../../mockStore';
import { CANCEL_ORDER } from '../../../src/modules/transactions/constants/types';
import { BID } from '../../../src/modules/bids-asks/constants/bids-asks-types';
import { CANCELLING } from '../../../src/modules/bids-asks/constants/order-status';
import { CANCELLING_ORDER } from '../../../src/modules/transactions/constants/statuses';
import { SHOW_CANCEL_ORDER_CONFIRMATION, ABORT_CANCEL_ORDER_CONFIRMATION } from '../../../src/modules/bids-asks/actions/cancel-order';

describe('modules/bids-asks/actions/cancel-order.js', () => {
	proxyquire.noPreserveCache().noCallThru();

	const { mockStore, actionCreator } = mocks;
	const addCancelTransaction = actionCreator();
	const cancel = sinon.stub();
	const updateOrderStatus = actionCreator();
	const updateExistingTransaction = actionCreator();
	const cancelOrderModule = proxyquire('../../../src/modules/bids-asks/actions/cancel-order', {
		'../../transactions/actions/add-cancel-transaction': { addCancelTransaction },
		'../../../services/augurjs': { cancel },
		'../../bids-asks/actions/update-order': { updateOrderStatus },
		'../../transactions/actions/update-existing-transaction': { updateExistingTransaction }
	});

	const store = mockStore({
		transactionsData: {
			cancelTxn: {
				type: CANCEL_ORDER,
				data: {
					orderID: 'orderID',
					marketID: 'marketID',
					type: BID
				}
			}
		}
	});

	afterEach(() => {
		addCancelTransaction.reset();
		cancel.reset();
		updateOrderStatus.reset();
		updateExistingTransaction.reset();
		store.clearActions();
	});

	describe('cancelOrder', () => {
		it('should pass params tp addCancelTransaction', () => {
			store.dispatch(cancelOrderModule.cancelOrder('orderID', 'marketID', 'buy'));
			assert.deepEqual(addCancelTransaction.args[0], ['orderID', 'marketID', 'buy']);
		});
	});

	describe('processCancelOrder', () => {
		it(`shouldn't call anything for non-existing transaction`, () => {
			store.dispatch(cancelOrderModule.processCancelOrder('non-existingID', 'orderID'));

			assert.strictEqual(cancel.callCount, 0);
			assert.strictEqual(updateOrderStatus.callCount, 0);
			assert.strictEqual(updateExistingTransaction.callCount, 0);
			assert.lengthOf(store.getActions(), 0);
		});

		it('should call actions and then augurJS', () => {
			store.dispatch(cancelOrderModule.processCancelOrder('cancelTxn', 'orderID'));

			assert.deepEqual(updateOrderStatus.args[0], ['orderID', CANCELLING, 'marketID', BID]);
			assert.deepEqual(updateExistingTransaction.args[0], ['cancelTxn', { status: CANCELLING_ORDER }]);
			assert.lengthOf(cancel.args[0], 5);
			assert.equal(cancel.args[0][0], 'orderID');
		});
	});

	describe('abortCancelOrderConfirmation', () => {
		it('should produce action', () => {
			store.dispatch(cancelOrderModule.abortCancelOrderConfirmation('orderID'));
			assert.lengthOf(store.getActions(), 1);
			assert.deepEqual(store.getActions(), [{ type: ABORT_CANCEL_ORDER_CONFIRMATION, orderID: 'orderID'}])
		});
	});

	describe('showCancelOrderConfirmation', () => {
		it('should produce action', () => {
			store.dispatch(cancelOrderModule.showCancelOrderConfirmation('orderID'));
			assert.lengthOf(store.getActions(), 1);
			assert.deepEqual(store.getActions(), [{ type: SHOW_CANCEL_ORDER_CONFIRMATION, orderID: 'orderID'}])
		});
	});

});
