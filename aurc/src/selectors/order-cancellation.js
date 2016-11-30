export default {
	cancellationStatuses: {
		CANCELLATION_CONFIRMATION: 'CANCELLATION_CONFIRMATION',
		CANCELLING: 'CANCELLING',
		CANCELLED: 'CANCELLED',
		CANCELLATION_FAILED: 'CANCELLATION_FAILED'
	},
	cancelOrder: (orderID) => {
		require('../selectors').orderCancellation[orderID] = require('../selectors').orderCancellation.cancellationStatuses.CANCELLING;
		require('../selectors').update({});

		setTimeout(() => {
			require('../selectors').markets.forEach((market) => {
				market.outcomes.forEach((outcome) => {
					const order = outcome.userOpenOrders.find(openOrder => openOrder.id === orderID);
					if (order != null) {
						if (order.type === 'buy') {
							// cancellation success => remove
							const index = outcome.userOpenOrders.findIndex(openOrder => openOrder.id === orderID);
							outcome.userOpenOrders.splice(index, 1);
						} else {
							// cancellation failure => display cancel action again
							require('../selectors').orderCancellation[orderID] = require('../selectors').orderCancellation.cancellationStatuses.CANCELLATION_FAILED;

							setTimeout(() => {
								delete require('../selectors').orderCancellation[orderID];
								require('../selectors').update({});
							}, 2000);
						}
						require('../selectors').update({});
					}
				});
			});
		}, 2000);
	},
	showCancelOrderConfirmation: (orderID) => {
		// prevent accidental cancellation from double click
		setTimeout(() => {
			require('../selectors').orderCancellation[orderID] = require('../selectors').orderCancellation.cancellationStatuses.CANCELLATION_CONFIRMATION;
			require('../selectors').update({});
		}, 300);
	},
	abortCancelOrderConfirmation: (orderID) => {
		delete require('../selectors').orderCancellation[orderID];
		require('../selectors').update({});
	}
};
