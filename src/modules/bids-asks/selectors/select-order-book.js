import memoizerific from 'memoizerific';

import { formatShares, formatEther } from '../../../utils/format-number';

/**
 * @param {String} outcomeId
 * @param {Object} marketOrderBook
 */
export const selectAggregateOrderBook = memoizerific(100)((outcomeId, marketOrderBook) => {
	if (marketOrderBook == null) {
		return {
			bids: [],
			asks: []
		};
	}

	return {
		bids: selectAggregatePricePoints(outcomeId, marketOrderBook.buy).sort(sortPricePointsByPriceDesc),
		asks: selectAggregatePricePoints(outcomeId, marketOrderBook.sell).sort(sortPricePointsByPriceAsc)
	};
});

export const selectTopBidPrice = memoizerific(10)((marketOrderBook) => {
	const topBid = marketOrderBook.bids[0];
	return topBid != null ? topBid.price : null;
});

export const selectTopAskPrice = memoizerific(10)((marketOrderBook) => {
	const topAsk = marketOrderBook.asks[0];
	return topAsk != null ? topAsk.price : null;
});

/**
 * Selects price points with aggregated amount of shares
 *
 * @param {String} outcomeId
 * @param {Array} orders
 */
const selectAggregatePricePoints = memoizerific(100)((outcomeId, orders) => {
	if (orders == null) {
		return [];
	}
	const shareCountPerPrice = orders
		.filter(order => order.outcome === outcomeId)
		.reduce(reduceSharesCountByPrice, {});

	return Object.keys(shareCountPerPrice)
		.map((price) => {
			const obj = {
				shares: formatShares(shareCountPerPrice[price]),
				price: formatEther(parseFloat(price))
			};
			return obj;
		});
});

/**
 *
 *
 * @param {Object} aggregateOrdersPerPrice
 * @param order
 * @return {Object} aggregateOrdersPerPrice
 */
function reduceSharesCountByPrice(aggregateOrdersPerPrice, order) {
	const key = parseFloat(order.price).toString(); // parseFloat("0.10000000000000000002").toString() => "0.1"
	if (aggregateOrdersPerPrice[key] == null) {
		aggregateOrdersPerPrice[key] = 0;
	}

	aggregateOrdersPerPrice[key] += parseFloat(order.amount);
	return aggregateOrdersPerPrice;
}

function sortPricePointsByPriceAsc(pricePoint1, pricePoint2) {
	return pricePoint1.price.value - pricePoint2.price.value;
}

function sortPricePointsByPriceDesc(pricePoint1, pricePoint2) {
	return pricePoint2.price.value - pricePoint1.price.value;
}
