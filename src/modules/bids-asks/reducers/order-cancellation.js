import { ABORT_CANCEL_ORDER_CONFIRMATION, SHOW_CANCEL_ORDER_CONFIRMATION } from '../../bids-asks/actions/cancel-order';
import { UPDATE_ORDER_STATUS } from '../../bids-asks/actions/update-order-status';
import { CANCELLATION_CONFIRMATION } from '../../bids-asks/constants/order-status';

/**
 * @param {Object} orderCancellation
 * @param {Object} action
 * @return {{}} key: orderID, value: String
 */
export default function (orderCancellation = {}, action) {
	switch (action.type) {
		case UPDATE_ORDER_STATUS:
			return {
				...orderCancellation,
				[action.orderID]: action.status
			};

		case SHOW_CANCEL_ORDER_CONFIRMATION:
			return {
				...orderCancellation,
				[action.orderID]: CANCELLATION_CONFIRMATION
			};

		case ABORT_CANCEL_ORDER_CONFIRMATION: {
			const newOrderCancellation = {
				...orderCancellation
			};
			delete newOrderCancellation[action.orderID];
			return newOrderCancellation;
		}

		default:
			return orderCancellation;
	}
}
