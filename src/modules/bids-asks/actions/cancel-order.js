/*
 * Author: priecint
 */
import { addCancelTransaction } from '../../transactions/actions/add-cancel-transaction';
import { updateOrderStatus } from '../../bids-asks/actions/update-order';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import getOrder from '../../bids-asks/helpers/get-order';
import * as augurJS from '../../../services/augurjs';
import { CANCELLED, CANCELLING, CANCELLATION_FAILED } from '../../bids-asks/constants/order-status';
import { CANCELLING_ORDER, SUCCESS, FAILED } from '../../transactions/constants/statuses';

const TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS = 3000;

export const SHOW_CANCEL_ORDER_CONFIRMATION = 'SHOW_CANCEL_ORDER_CONFIRMATION';
export const ABORT_CANCEL_ORDER_CONFIRMATION = 'ABORT_CANCEL_ORDER_CONFIRMATION';

export function cancelOrder(orderID, marketID, type) {
	return (dispatch, getState) => {
		const { marketOrderBooks, outcomesData, marketsData } = getState();
		const order = getOrder(orderID, marketID, type, marketOrderBooks);
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

		const { transactionsData, marketOrderBooks } = getState();
		const transaction = transactionsData[transactionID];
		if (transaction == null) {
			return;
		}

		const order = getOrder(orderID, transaction.data.market.id, transaction.data.order.type, marketOrderBooks);
		if (order == null) {
			return;
		}

		dispatch(updateOrderStatus(orderID, CANCELLING, transaction.data.market.id, transaction.data.order.type));
		dispatch(updateExistingTransaction(transactionID, { status: CANCELLING_ORDER }));

		augurJS.cancel(orderID,
			function onSent(res) {
				console.log('onSent %o', res);
			},
			function onSuccess(res) {
				console.log('onSucc %o', res);
				dispatch(updateOrderStatus(orderID, CANCELLED, transaction.data.market.id, transaction.data.order.type));
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
				setTimeout(() => dispatch(loadBidsAsks(transaction.data.market.id)), TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS);
			},
			function onFailure(res) {
				console.log('onFail %o', res);
				dispatch(updateOrderStatus(orderID, CANCELLATION_FAILED, transaction.data.market.id, transaction.data.order.type));
				dispatch(updateExistingTransaction(transactionID, { status: FAILED }));
				setTimeout(() => dispatch(updateOrderStatus(orderID, null, transaction.data.market.id, transaction.data.order.type)), TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS);
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
