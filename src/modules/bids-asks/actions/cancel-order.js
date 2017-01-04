import { augur } from '../../../services/augurjs';
import { updateOrderStatus } from '../../bids-asks/actions/update-order-status';
import getOrder from '../../bids-asks/helpers/get-order';
import { CANCELLED, CANCELLING, CANCELLATION_FAILED } from '../../bids-asks/constants/order-status';

const TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS = 3000;

export const SHOW_CANCEL_ORDER_CONFIRMATION = 'SHOW_CANCEL_ORDER_CONFIRMATION';
export const ABORT_CANCEL_ORDER_CONFIRMATION = 'ABORT_CANCEL_ORDER_CONFIRMATION';

export function cancelOrder(orderID, marketID, type) {
	return (dispatch, getState) => {
		const { orderBooks, outcomesData, marketsData } = getState();
		const order = getOrder(orderID, marketID, type, orderBooks);
		const market = marketsData[marketID];
		if (order != null && market != null && outcomesData[marketID] != null) {
			const outcome = outcomesData[marketID][order.outcome];
			if (outcome != null) {
				dispatch(updateOrderStatus(orderID, CANCELLING, marketID, type));
				augur.cancel({
					trade_id: orderID,
					onSent: res => console.log('cancel sent:', res),
					onSuccess: (res) => {
						console.log('cancel success:', res);
						dispatch(updateOrderStatus(orderID, CANCELLED, marketID, type));
					},
					onFailed: (err) => {
						console.error('cancel failed:', err);
						dispatch(updateOrderStatus(orderID, CANCELLATION_FAILED, marketID, type));
						setTimeout(() => dispatch(updateOrderStatus(orderID, null, marketID, type)), TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS);
					}
				});
			}
		}
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
