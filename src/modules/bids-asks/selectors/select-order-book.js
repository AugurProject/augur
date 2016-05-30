import memoizerific from 'memoizerific';

import { formatShares, formatEther } from '../../../utils/format-number';

export const selectOrderBook = memoizerific(100)((outcomeId, marketOrderBook) => {
	if (marketOrderBook == null) {
		return {
			bids: [],
			asks: []
		};
	}

	const outcomeBidsAsks = marketOrderBook.buy.concat(marketOrderBook.sell)
		.filter(order => order != null && order.outcome === outcomeId);
	return {
		bids: outcomeBidsAsks
			.filter(order => order.type === "buy")
			.map(selectOrder)
			.sort(sortBids),
		asks: outcomeBidsAsks
			.filter(order => order.type === "sell")
			.map(selectOrder)
			.sort(sortAsks)
	};
});

export const selectOrder = memoizerific(100)((orderData) => {
	return {
		shares: formatShares(orderData.amount),
		price: formatEther(orderData.price)
	}
});

function sortAsks(ask1, ask2) {
	return ask1.price.value < ask2.price.value ? -1 : 1;
}

function sortBids(bid1, bid2) {
	return bid1.price.value > bid2.price.value ? -1 : 1;
}
