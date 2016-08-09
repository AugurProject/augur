import memoizerific from 'memoizerific';

import store from '../../../store';
import { formatShares, formatEther } from '../../../utils/format-number';
import { isOrderOfUser } from '../../bids-asks/helpers/is-order-of-user';
import { CANCELLED } from '../../bids-asks/constants/order-status';

/**
 * @param {String} outcomeId
 * @param {Object} marketOrderBook
 */
export const selectAggregateOrderBook = memoizerific(100)((outcomeId, marketOrderBook, orderCancellation) => {
	if (marketOrderBook == null) {
		return {
			bids: [],
			asks: []
		};
	}

	return {
		bids: selectAggregatePricePoints(outcomeId, marketOrderBook.buy, orderCancellation).sort(sortPricePointsByPriceDesc),
		asks: selectAggregatePricePoints(outcomeId, marketOrderBook.sell, orderCancellation).sort(sortPricePointsByPriceAsc)
	};
});

export const selectTopBid = memoizerific(10)((marketOrderBook) => {
	const topBid = marketOrderBook.bids[0];
	return topBid != null ? topBid : null;
});

export const selectTopAsk = memoizerific(10)((marketOrderBook) => {
	const topAsk = marketOrderBook.asks[0];
	return topAsk != null ? topAsk : null;
});

/**
 * Selects price points with aggregated amount of shares
 *
 * @param {String} outcomeId
 * @param {{String, Object}} orders Key is order ID, value is order
 */
const selectAggregatePricePoints = memoizerific(100)((outcomeId, orders, orderCancellation) => {
	if (orders == null) {
		return [];
	}
	const currentUserAddress = store.getState().loginAccount.address;

	const shareCountPerPrice = Object.keys(orders)
		.map(orderId => orders[orderId])
		.filter(order => order.outcome === outcomeId && orderCancellation[order.id] !== CANCELLED)
		.map(order => ({
			...order,
			isOfCurrentUser: isOrderOfUser(order, currentUserAddress)
		}))
		.reduce(reduceSharesCountByPrice, {});

	return Object.keys(shareCountPerPrice)
		.map((price) => {
			const obj = {
				isOfCurrentUser: shareCountPerPrice[price].isOfCurrentUser,
				shares: formatShares(shareCountPerPrice[price].shares),
				price: formatEther(parseFloat(price), { roundUp: true })
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
		aggregateOrdersPerPrice[key] = {
			shares: 0,
			isOfCurrentUser: false
		};
	}

	aggregateOrdersPerPrice[key].shares += parseFloat(order.amount);
	aggregateOrdersPerPrice[key].isOfCurrentUser = aggregateOrdersPerPrice[key].isOfCurrentUser || order.isOfCurrentUser;
	return aggregateOrdersPerPrice;
}

function sortPricePointsByPriceAsc(pricePoint1, pricePoint2) {
	return pricePoint1.price.value - pricePoint2.price.value;
}

function sortPricePointsByPriceDesc(pricePoint1, pricePoint2) {
	return pricePoint2.price.value - pricePoint1.price.value;
}
