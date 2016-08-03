/*
 * Author: priecint
 */
import { addCancelTransaction } from '../../transactions/actions/add-cancel-transaction';
import { updateOrderStatus } from '../../bids-asks/actions/update-order';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import * as augurJS from '../../../services/augurjs';
import { CANCELLED, CANCELLING, CANCELLATION_FAILED } from '../../bids-asks/constants/order-status';
import { CANCELLING_ORDER, SUCCESS, FAILED } from '../../transactions/constants/statuses';

export const SHOW_CANCEL_ORDER_CONFIRMATION = 'SHOW_CANCEL_ORDER_CONFIRMATION';
export const ABORT_CANCEL_ORDER_CONFIRMATION = 'ABORT_CANCEL_ORDER_CONFIRMATION';

export function cancelOrder(orderID, marketID, type) {
	return (dispatch, getState) => {
		dispatch(addCancelTransaction(orderID, marketID, type));
	};
}

export function processCancelOrder(transactionID, orderID) {
	return (dispatch, getState) => {
		const transaction = getState().transactionsData[transactionID];
		if (transaction == null) {
			return;
		}

		dispatch(updateOrderStatus(orderID, CANCELLING, transaction.data.marketID, transaction.data.type));
		dispatch(updateExistingTransaction(transactionID, { status: CANCELLING_ORDER }));

		augurJS.cancel(orderID,
			function onSent(res) {
				console.log('onSent %o', res);
			},
			function onSuccess(res) {
				console.log('onSucc %o', res);
				dispatch(updateOrderStatus(orderID, CANCELLED, transaction.data.marketID, transaction.data.type));
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
			},
			function onFailure(res) {
				console.log('onFail %o', res);
				dispatch(updateOrderStatus(orderID, CANCELLATION_FAILED, transaction.data.marketID, transaction.data.type));
				dispatch(updateExistingTransaction(transactionID, { status: FAILED }));
			},
			function onConfirmed(res) {
				console.log('onConfirmed %o', res);
			}
		);
	};
}

/**
 *
 * @param {String} orderID
 * @return {{type: string, orderID: *}}
 */
export function showCancelOrderConfirmation(orderID) {
	return {
		type: SHOW_CANCEL_ORDER_CONFIRMATION,
		orderID
	};
}

/**
 *
 * @param {String} orderID
 * @return {{type: string, orderID: *}}
 */
export function abortCancelOrderConfirmation(orderID) {
	return {
		type: ABORT_CANCEL_ORDER_CONFIRMATION,
		orderID
	};
}
