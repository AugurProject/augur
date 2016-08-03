/*
 * Author: priecint
 */
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import mocks from '../../mockStore';
import { BID } from '../../../src/modules/bids-asks/constants/bids-asks-types';
import { CANCEL_ORDER } from "../../../src/modules/transactions/constants/types";

describe('modules/transactions/actions/add-cancel-transaction.js', () => {
	proxyquire.noPreserveCache().noCallThru();

	const processCancelOrder = mocks.actionCreator();
	const addTransaction = mocks.actionCreator();
	const addCancelTransactionModule = proxyquire('../../../src/modules/transactions/actions/add-cancel-transaction', {
		'../../bids-asks/actions/cancel-order': {
			processCancelOrder
		},
		'../../transactions/actions/add-transactions': {
			addTransaction
		}
	});

	const { store } = mocks;

	describe('addCancelTransaction', () => {
		it('should dispatch correct action', () => {
			store.dispatch(addCancelTransactionModule.addCancelTransaction('orderID', 'marketID', BID));

			assert.strictEqual(addTransaction.callCount, 1);
			const firstArg = addTransaction.args[0][0];
			assert.property(firstArg, 'type');
			assert.property(firstArg, 'gas');
			assert.property(firstArg, 'ether');
			assert.deepProperty(firstArg, 'data.orderID');
			assert.deepProperty(firstArg, 'data.marketID');
			assert.deepProperty(firstArg, 'data.type');
			assert.isFunction(firstArg.action);
		});
	});

	describe('makeCancelTransaction', () => {
		const dispatch = sinon.spy();
		const transaction = addCancelTransactionModule.makeCancelTransaction('orderID', 'marketID', 'type', null, null, dispatch);
		it('should return transaction', () => {
			assert.deepEqual(transaction, {
				type: CANCEL_ORDER,
				gas: null,
				ether: null,
				data: {
					orderID: 'orderID',
					marketID: 'marketID',
					type: 'type'
				},
				action: transaction.action // reference the returned function so the values equal
			});
			assert.isFunction(addTransaction.args[0][0].action);
			assert.lengthOf(addTransaction.args[0][0].action, 1);
			console.log(addTransaction.args[0][0].action.toString())
		});

		it('should call correct action when transaction.action() is called', () => {
			assert.strictEqual(dispatch.callCount, 0);
			assert.strictEqual(processCancelOrder.callCount, 0);
			transaction.action('txn id');
			assert.strictEqual(dispatch.callCount, 1);
			assert.strictEqual(processCancelOrder.callCount, 1);
		});
	});
});
