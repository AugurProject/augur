import store from '../../../store';

export default function (orderID) {
	const { orderBooks } = store.getState();
	return selectOrderFromOrderID(orderID, orderBooks);
}

export function selectOrderFromOrderID(orderID, orderBooks) {
	const marketIDs = Object.keys(orderBooks);
	const numMarkets = marketIDs.length;
	for (let i = 0; i < numMarkets; ++i) {
		const orderBook = orderBooks[marketIDs[i]];
		const order = selectOrderInOrderBookSide(orderID, orderBook.buy) ||
			selectOrderInOrderBookSide(orderID, orderBook.sell);
		if (order) return order;
	}
}

export function selectOrderInOrderBookSide(orderID, orderBookSide) {
	const orderIDs = Object.keys(orderBookSide);
	const numOrderIDs = orderIDs.length;
	for (let j = 0; j < numOrderIDs; ++j) {
		if (orderBookSide[orderID]) return orderBookSide[orderID];
	}
}
