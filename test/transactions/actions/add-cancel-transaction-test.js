/*
 * Author: priecint
 */
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import mocks from '../../mockStore';
import { BID } from '../../../src/modules/bids-asks/constants/bids-asks-types';
import { CANCEL_ORDER } from "../../../src/modules/transactions/constants/types";
import { formatShares, formatEther } from '../../../src/utils/format-number'

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

	afterEach(() => {
		processCancelOrder.reset();
		addTransaction.reset();
	});

	const { store } = mocks;

	describe('addCancelTransaction', () => {
		it('should dispatch correct action', () => {
			store.dispatch(addCancelTransactionModule.addCancelTransaction('orderID', 'marketID', BID));

			sinon.assert.calledOnce(addTransaction);
		});
	});

	describe('makeCancelTransaction', () => {
		const order = {
			id: 'orderID',
			type: BID,
			shares: formatShares(1),
			price: formatEther(10)
		};
		const market = {
			id: 'marketID',
			description: 'market description'
		};
		const outcome = {
			name: 'outcome name'
		};
		const gas = null;
		const ether = null;
		const dispatch = sinon.spy();

		const transaction = addCancelTransactionModule.makeCancelTransaction(order, market, outcome, ether, gas, dispatch);
		it('should return transaction', () => {
			assert.deepEqual(transaction, {
				type: CANCEL_ORDER,
				gas,
				ether,
				data: {
					order,
					outcome,
					market,
				},
				action: transaction.action
			});
			assert.isFunction(transaction.action);
			assert.lengthOf(transaction.action, 1);
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
