import memoizerific from 'memoizerific';

import { abi } from '../../../services/augurjs';

import { formatShares, formatEther } from '../../../utils/format-number';

import { CANCELLED } from '../../bids-asks/constants/order-status';
import { ZERO } from '../../trade/constants/numbers';

import { isOrderOfUser } from '../../bids-asks/helpers/is-order-of-user';

import store from '../../../store';

/**
 * @param {String} outcomeID
 * @param {Object} marketOrderBook
 */
export const selectAggregateOrderBook = memoizerific(100)((outcomeID, marketOrderBook, orderCancellation) => {
	if (marketOrderBook == null) {
		return {
			bids: [],
			asks: []
		};
	}

	return {
		bids: selectAggregatePricePoints(outcomeID, marketOrderBook.buy, orderCancellation).sort(sortPricePointsByPriceDesc),
		asks: selectAggregatePricePoints(outcomeID, marketOrderBook.sell, orderCancellation).sort(sortPricePointsByPriceAsc)
	};
});

export const selectTopBid = memoizerific(10)((marketOrderBook, excludeCurrentUser) => {
	let topBid;
	if (excludeCurrentUser) {
		const numBids = marketOrderBook.bids.length;
		if (numBids) {
			for (let i = 0; i < numBids; ++i) {
				if (!marketOrderBook.bids[i].isOfCurrentUser) {
					topBid = marketOrderBook.bids[i];
					break;
				}
			}
		}
	} else {
		topBid = marketOrderBook.bids[0];
	}
	return topBid != null ? topBid : null;
});

export const selectTopAsk = memoizerific(10)((marketOrderBook, excludeCurrentUser) => {
	let topAsk;
	if (excludeCurrentUser) {
		const numAsks = marketOrderBook.asks.length;
		if (numAsks) {
			for (let i = 0; i < numAsks; ++i) {
				if (!marketOrderBook.asks[i].isOfCurrentUser) {
					topAsk = marketOrderBook.asks[i];
					break;
				}
			}
		}
	} else {
		topAsk = marketOrderBook.asks[0];
	}
	return topAsk != null ? topAsk : null;
});

/**
 * Selects price points with aggregated amount of shares
 *
 * @param {String} outcomeID
 * @param {{String, Object}} orders Key is order ID, value is order
 */
const selectAggregatePricePoints = memoizerific(100)((outcomeID, orders, orderCancellation) => {
	if (orders == null) {
		return [];
	}
	const currentUserAddress = store.getState().loginAccount.address;

	const shareCountPerPrice = Object.keys(orders)
		.map(orderId => orders[orderId])
		.filter(order => order.outcome === outcomeID && orderCancellation[order.id] !== CANCELLED)
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
	const key = abi.bignum(order.price).toFixed();
	if (aggregateOrdersPerPrice[key] == null) {
		aggregateOrdersPerPrice[key] = {
			shares: ZERO,
			isOfCurrentUser: false
		};
	}

	aggregateOrdersPerPrice[key].shares = aggregateOrdersPerPrice[key].shares.plus(abi.bignum(order.amount));
	aggregateOrdersPerPrice[key].isOfCurrentUser = aggregateOrdersPerPrice[key].isOfCurrentUser || order.isOfCurrentUser;

	return aggregateOrdersPerPrice;
}

function sortPricePointsByPriceAsc(pricePoint1, pricePoint2) {
	return pricePoint1.price.value - pricePoint2.price.value;
}

function sortPricePointsByPriceDesc(pricePoint1, pricePoint2) {
	return pricePoint2.price.value - pricePoint1.price.value;
}
