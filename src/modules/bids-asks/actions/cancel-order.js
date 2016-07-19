/*
 * Author: priecint
 */
import * as augurJS from '../../../services/augurjs';
import { updateOrderStatus } from '../../bids-asks/actions/update-order';
import { CANCELLED, CANCELLING, CANCELLATION_FAILED } from '../../bids-asks/constants/order-status';
import { addCancelTransaction } from '../../transactions/actions/add-cancel-transaction';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { CANCELLING_ORDER, SUCCESS, FAILED } from '../../transactions/constants/statuses';

export const CANCEL_ORDER = 'CANCEL_ORDER';

export function cancelOrder(orderID, marketID, type) {
	return (dispatch, getState) => {
		dispatch(addCancelTransaction(orderID, marketID, type));
	};
}

export function processCancelOrder(transactionID, orderID) {
	return (dispatch, getState) => {
		const transaction = getState().transactionsData[transactionID];

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
			}
		);
	};
}
