import { describe, it, afterEach } from 'mocha';
import { assert } from 'chai';
import BigNumber from 'bignumber.js';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import mocks from '../../mockStore';
import { CANCEL_ORDER } from '../../../src/modules/transactions/constants/types';
import { BID, ASK } from '../../../src/modules/bids-asks/constants/bids-asks-types';
import { CANCELLING } from '../../../src/modules/bids-asks/constants/order-status';
import { CANCELLING_ORDER } from '../../../src/modules/transactions/constants/statuses';
import { SHOW_CANCEL_ORDER_CONFIRMATION, ABORT_CANCEL_ORDER_CONFIRMATION } from '../../../src/modules/bids-asks/actions/cancel-order';

describe('modules/bids-asks/actions/cancel-order.js', () => {
	proxyquire.noPreserveCache().noCallThru();

	const { mockStore, actionCreator, state } = mocks;
	const addCancelTransaction = actionCreator();
	const augur = {
		cancel: sinon.stub(),
		rpc: { gasPrice: 1 },
		tx: { BuyAndSellShares: { cancel: {} } },
		getTxGasEth: sinon.stub()
	};
	const updateOrderStatus = actionCreator();
	const updateExistingTransaction = actionCreator();
	const cancelOrderModule = proxyquire('../../../src/modules/bids-asks/actions/cancel-order', {
		'../../transactions/actions/add-cancel-transaction': { addCancelTransaction },
		'../../../services/augurjs': {
			augur,
			abi: { bignum: sinon.stub().returns(new BigNumber('1', 10)) },
		},
		'../../bids-asks/actions/update-order-status': { updateOrderStatus },
		'../../transactions/actions/update-existing-transaction': { updateExistingTransaction }
	});

	const store = mockStore({
		...state,
		transactionsData: {
			cancelTxn: {
				type: CANCEL_ORDER,
				data: {
					order: {
						id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
						type: BID
					},
					market: { id: 'testMarketID' },
					outcome: {}
				}
			}
		}
	});

	afterEach(() => {
		addCancelTransaction.reset();
		augur.cancel.reset();
		updateOrderStatus.reset();
		updateExistingTransaction.reset();
		store.clearActions();
	});

	describe('cancelOrder', () => {
		it(`shouldn't dispatch it order doesn't exist`, () => {
			store.dispatch(cancelOrderModule.cancelOrder('nonExistingOrderID', 'testMarketID', BID));
			store.dispatch(cancelOrderModule.cancelOrder('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', 'nonExistingMarketID', BID));
			store.dispatch(cancelOrderModule.cancelOrder('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', 'testMarketID', ASK));
			sinon.assert.notCalled(addCancelTransaction);
		});

		it('should pass params to addCancelTransaction', () => {
			store.dispatch(cancelOrderModule.cancelOrder('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', 'testMarketID', BID));
			sinon.assert.calledOnce(addCancelTransaction);
		});
	});

	describe('processCancelOrder', () => {
		it(`shouldn't call anything for non-existing transaction`, () => {
			store.dispatch(cancelOrderModule.processCancelOrder('non-existingID', 'orderID'));

			assert.strictEqual(augur.cancel.callCount, 0);
			assert.strictEqual(updateOrderStatus.callCount, 0);
			assert.strictEqual(updateExistingTransaction.callCount, 0);
			assert.lengthOf(store.getActions(), 0);
		});

		it('should call actions and then augurJS', () => {
			store.dispatch(cancelOrderModule.processCancelOrder('cancelTxn', '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3'));

			assert.deepEqual(updateOrderStatus.args[0], ['0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', CANCELLING, 'testMarketID', BID]);
			assert.deepEqual(updateExistingTransaction.args[0], ['cancelTxn', {
				message: 'canceling order to buy 10 shares for 0.4200 ETH each',
				status: CANCELLING_ORDER,
				gasFees: {
					denomination: ' real ETH (estimated)',
					formatted: '0',
					formattedValue: 0,
					full: '0 real ETH (estimated)',
					minimized: '0',
					rounded: '0',
					roundedValue: 0,
					value: 0
				}
			}]);
			assert.lengthOf(augur.cancel.args[0], 1);
			assert.equal(augur.cancel.args[0][0].trade_id, '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3');
		});
	});

	describe('abortCancelOrderConfirmation', () => {
		it('should produce action', () => {
			store.dispatch(cancelOrderModule.abortCancelOrderConfirmation('orderID'));
			assert.lengthOf(store.getActions(), 1);
			assert.deepEqual(store.getActions(), [{ type: ABORT_CANCEL_ORDER_CONFIRMATION, orderID: 'orderID' }]);
		});
	});

	describe('showCancelOrderConfirmation', () => {
		it('should produce action', () => {
			store.dispatch(cancelOrderModule.showCancelOrderConfirmation('orderID'));
			assert.lengthOf(store.getActions(), 1);
			assert.deepEqual(store.getActions(), [{ type: SHOW_CANCEL_ORDER_CONFIRMATION, orderID: 'orderID' }]);
		});
	});
});
