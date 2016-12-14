import store from '../../../store';
import { cancelOrder, showCancelOrderConfirmation, abortCancelOrderConfirmation } from '../../bids-asks/actions/cancel-order';
import { CANCELLATION_CONFIRMATION, CANCELLATION_FAILED, CANCELLED, CANCELLING } from '../../bids-asks/constants/order-status';

export default () => {
	const { orderCancellation } = store.getState();

	return {
		...orderCancellation,
		cancellationStatuses: {
			CANCELLATION_CONFIRMATION, CANCELLATION_FAILED, CANCELLED, CANCELLING
		},
		cancelOrder: (orderID, marketID, type) => {
			store.dispatch(cancelOrder(orderID, marketID, type));
		},
		showCancelOrderConfirmation: (orderID) => {
			store.dispatch(showCancelOrderConfirmation(orderID));
		},
		abortCancelOrderConfirmation: (orderID) => {
			store.dispatch(abortCancelOrderConfirmation(orderID));
		}
	};
};
