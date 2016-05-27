export const UPDATE_ORDER_IDS = "UPDATE_ORDER_IDS";
export const UPDATE_ORDER = "UPDATE_ORDER";

export function updateOrderIds(marketId, orderIds) {
	return { type: UPDATE_ORDER_IDS, marketId, orderIds};
}

export function updateOrder(orderId, order) {
	return { type: UPDATE_ORDER, orderId, order};
}