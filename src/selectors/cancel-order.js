/*
 * Author: priecint
 */

export const cancelOrder = orderId => setTimeout(() => {
	require('../selectors').markets.forEach((market) => {
		market.outcomes.forEach(outcome => {
			const order = outcome.userOpenOrders.find(openOrder => openOrder.id === orderId);
			if (order != null) {
				order.isCancelling = true;
				require('../selectors').update({});
			}
		});
	});
	setTimeout(() => {
		require('../selectors').markets.forEach((market) => {
			market.outcomes.forEach(outcome => {
				const order = outcome.userOpenOrders.find(openOrder => openOrder.id === orderId);
				if (order != null) {
					const index = outcome.userOpenOrders.findIndex(openOrder => openOrder.id === orderId);
					outcome.userOpenOrders.splice(index, 1);
					require('../selectors').update({});
				}
			});
		});
	}, 2000);
}, 1);
