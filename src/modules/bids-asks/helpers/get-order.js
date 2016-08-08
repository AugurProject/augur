/*
 * Author: priecint
 */

/**
 *
 * @param {String} orderID
 * @param {String} marketID
 * @param {String} type
 * @param {Object} marketOrderBooks
 * @return {Object|null}
 */
export default function (orderID, marketID, type, marketOrderBooks) {
	const marketOrderBook = marketOrderBooks[marketID];

	if (marketOrderBook == null) {
		return null;
	}

	const orders = marketOrderBook[type];
	if (orders == null) {
		return null;
	}

	const order = orders[orderID];
	return order != null ? order : null;
}
