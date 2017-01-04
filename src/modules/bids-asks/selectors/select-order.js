import store from '../../../store';

export default function (orderID) {
	const { orderBooks } = store.getState();
	return selectOrder(orderID, orderBooks);
}

export function selectOrder(orderID, orderBooks) {
	const marketIDs = Object.keys(orderBooks);
	const numMarkets = marketIDs.length;
	for (let i = 0; i < numMarkets; ++i) {
		const orderBook = orderBooks[marketIDs[i]];
		const order = selectOrderFromOrderBookSide(orderID, orderBook.buy) ||
			selectOrderFromOrderBookSide(orderID, orderBook.sell);
		if (order) return order;
	}
}

export function selectOrderFromOrderBookSide(orderID, orderBookSide) {
	const orderIDs = Object.keys(orderBookSide);
	const numOrderIDs = orderIDs.length;
	for (let j = 0; j < numOrderIDs; ++j) {
		if (orderBookSide[orderID]) return orderBookSide[orderID];
	}
}
