import { formatEther, formatRealEther, formatShares, formatRealEtherEstimate } from '../../../utils/format-number';
import { addCancelTransaction } from '../../transactions/actions/add-cancel-transaction';
import { updateOrderStatus } from '../../bids-asks/actions/update-order-status';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';
import getOrder from '../../bids-asks/helpers/get-order';
import { augur } from '../../../services/augurjs';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';
import { CANCELLED, CANCELLING, CANCELLATION_FAILED } from '../../bids-asks/constants/order-status';
import { CANCELLING_ORDER, SUCCESS, FAILED } from '../../transactions/constants/statuses';

const TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS = 3000;

export const SHOW_CANCEL_ORDER_CONFIRMATION = 'SHOW_CANCEL_ORDER_CONFIRMATION';
export const ABORT_CANCEL_ORDER_CONFIRMATION = 'ABORT_CANCEL_ORDER_CONFIRMATION';

export function cancelOrder(orderID, marketID, type) {
	return (dispatch, getState) => {
		const { orderBooks, outcomesData, marketsData } = getState();
		const order = getOrder(orderID, marketID, type, orderBooks);
		const market = marketsData[marketID];

		if (order == null || market == null || outcomesData[marketID] == null) {
			return;
		}

		const outcome = outcomesData[marketID][order.outcome];
		if (outcome == null) {
			return;
		}

		dispatch(addCancelTransaction(order, { ...market, id: marketID }, outcome));
	};
}

export function processCancelOrder(transactionID, orderID) {
	return (dispatch, getState) => {

		const { transactionsData, orderBooks } = getState();
		const transaction = transactionsData[transactionID];
		if (transaction == null) {
			return;
		}

		const order = getOrder(orderID, transaction.data.market.id, transaction.data.order.type, orderBooks);
		if (order == null || !order.amount || !order.price) {
			return;
		}

		dispatch(updateOrderStatus(orderID, CANCELLING, transaction.data.market.id, transaction.data.order.type));
		dispatch(updateExistingTransaction(transactionID, {
			status: CANCELLING_ORDER,
			message: `canceling order to ${order.type} ${formatShares(order.amount).full} for ${formatEther(order.price).full} each`,
			gasFees: formatRealEtherEstimate(augur.getTxGasEth({ ...augur.tx.BuyAndSellShares.cancel }, augur.rpc.gasPrice))
		}));

		augur.cancel({
			trade_id: orderID,
			onSent: res => console.log('augur.cancel sent: %o', res),
			onSuccess: (res) => {
				console.log('augur.cancel success: %o', res);
				dispatch(updateOrderStatus(orderID, CANCELLED, transaction.data.market.id, transaction.data.order.type));
				dispatch(updateExistingTransaction(transactionID, {
					status: SUCCESS,
					message: `canceled order to ${order.type} ${formatShares(order.amount).full} for ${formatEther(order.price).full} each`,
					hash: res.hash,
					timestamp: res.timestamp,
					totalReturn: formatEther(res.cashRefund),
					gasFees: formatRealEther(res.gasFees)
				}));
				dispatch(deleteTransaction(transactionID));
			},
			onFailed: (res) => {
				console.log('augur.cancel failed: %o', res);
				dispatch(updateOrderStatus(orderID, CANCELLATION_FAILED, transaction.data.market.id, transaction.data.order.type));
				dispatch(updateExistingTransaction(transactionID, { status: FAILED }));
				setTimeout(() => dispatch(updateOrderStatus(orderID, null, transaction.data.market.id, transaction.data.order.type)), TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS);
			}
		});
	};
}

/**
 *
 * @param {String} orderID
 * @return {{type: string, orderID: *}}
 */
export function showCancelOrderConfirmation(orderID) {
	return { type: SHOW_CANCEL_ORDER_CONFIRMATION, orderID };
}

/**
 *
 * @param {String} orderID
 * @return {{type: string, orderID: *}}
 */
export function abortCancelOrderConfirmation(orderID) {
	return { type: ABORT_CANCEL_ORDER_CONFIRMATION, orderID };
}
