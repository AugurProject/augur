/*
 * Author: priecint
 */

export default {
	cancellationStatuses: {
		CANCELLATION_CONFIRMATION: 'CANCELLATION_CONFIRMATION',
		CANCELLING: 'CANCELLING',
		CANCELLED: 'CANCELLED',
		CANCELLATION_FAILED: 'CANCELLATION_FAILED'
	},
	cancelOrder: orderID => {
		require('../selectors').orderCancellation[orderID] = require('../selectors').orderCancellation.cancellationStatuses.CANCELLING;
		require('../selectors').update({});

		setTimeout(() => {
			require('../selectors').markets.forEach((market) => {
				market.outcomes.forEach(outcome => {
					const order = outcome.userOpenOrders.find(openOrder => openOrder.id === orderID);
					if (order != null) {
						const index = outcome.userOpenOrders.findIndex(openOrder => openOrder.id === orderID);
						outcome.userOpenOrders.splice(index, 1);
						require('../selectors').update({});
					}
				});
			});
		}, 2000);
	},
	showCancelOrderConfirmation: orderID => {
		setTimeout(() => {
			require('../selectors').orderCancellation[orderID] = require('../selectors').orderCancellation.cancellationStatuses.CANCELLATION_CONFIRMATION;
			require('../selectors').update({});
		}, 300);
	},
	abortCancelOrderConfirmation: orderID => {
		delete require('../selectors').orderCancellation[orderID];
		require('../selectors').update({});
	}
};
