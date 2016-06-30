/*
 * Author: priecint
 */
/**
 * Allows to estimate what trading methods will be called based on user's order. This is useful so users know how much
 * they pay for trading
 *
 * @param {String} type buy or sell
 * @param {Number} shares
 * @param {Number} limitPrice
 * @param {String} userAddress To exclude user's orders
 * @param {Number} userPositionShares
 * @param {String} outcomeId
 * @param {Object} marketOrderBook Bids and asks for market (mixed for all outcomes)
 * @return {Array}
 */
module.exports = function getTradingActions(type, shares, limitPrice, userAddress, userPositionShares, outcomeId, marketOrderBook) {
	if (type.constructor === Object && type.type) {
		shares = type.shares;
		limitPrice = type.limitPrice;
		userAddress = type.userAddress;
		userPositionShares = type.userPositionShares;
		outcomeId = type.outcomeId;
		marketOrderBook = type.marketOrderBook;
		type = type.type;
	}

	if (type === "buy") {
		var matchingSortedAskIds = marketOrderBook.sell
			.filter(function filterOrdersByOutcomeAndOwnerAndPrice(ask) {
				return ask.outcome === outcomeId &&
					ask.owner !== userAddress &&
					parseFloat(ask.price) <= limitPrice;
			}, this)
			.sort(function compareOrdersByPriceAsc(order1, order2) {
				return order1.price - order2.price;
			})
			.map(function getOrderId(ask) {
				return ask.id;
			});

		if (matchingSortedAskIds.length === 0) {
			return [{
				action: "BID",
				fee: null,
				totalEther: null,
				avgPrice: null
			}];
		}
	}
};