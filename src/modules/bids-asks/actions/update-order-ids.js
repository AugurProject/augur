export const UPDATE_ORDER_IDS = "UPDATE_ORDER_IDS";

export default function (marketId, orderIds) {
	return { type: UPDATE_ORDER_IDS, marketId, orderIds};
}