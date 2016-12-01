import { describe, it, afterEach } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import mocks from '../../mockStore';
import { BID } from '../../../src/modules/bids-asks/constants/bids-asks-types';
import { CANCEL_ORDER } from '../../../src/modules/transactions/constants/types';
import { formatShares, formatEther } from '../../../src/utils/format-number';

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
			store.dispatch(addCancelTransactionModule.addCancelTransaction('orderID', 'testMarketID', BID));

			sinon.assert.calledOnce(addTransaction);
		});
	});

	describe('makeCancelTransaction', () => {
		const order = {
			amount: '10',
			block: 1234,
			id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
			market: 'testMarketID',
			outcome: '2',
			owner: '0x7c0d52faab596c08f423e3478aebc6205f3f5d8c',
			price: '0.42',
			type: 'buy'
		};
		const market = {
			id: 'testMarketID',
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
					marketID: 'testMarketID',
					marketDescription: 'market description',
					order: {
						id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
						type: BID,
						shares: formatShares(10),
						price: formatEther(0.42)
					},
					outcome,
					market: {
						id: 'testMarketID',
						description: 'market description'
					},
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
