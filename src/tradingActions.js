/*
 * Author: priecint
 */
var ethTx = require("ethereumjs-tx");
var clone = require("clone");
var constants = require("../src/constants");

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
 * @param {Function} cb
 * @return {Array}
 */
module.exports = function getTradingActions(type, shares, limitPrice, userAddress, userPositionShares, outcomeId, marketOrderBook, cb) {
	if (type.constructor === Object && type.type) {
		shares = type.shares;
		limitPrice = type.limitPrice;
		userAddress = type.userAddress;
		userPositionShares = type.userPositionShares;
		outcomeId = type.outcomeId;
		marketOrderBook = type.marketOrderBook;
		cb = type.cb;
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
			// there are no suitable asks on order book so user will add to order book
			var tx = clone(this.tx.BuyAndSellShares.buy);
			tx.gasLimit = tx.gas || constants.DEFAULT_GAS;
			// tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome]; // this is probably not needed now
			this.rpc.gasPrice(function (gasPrice) {
				if (!gasPrice || gasPrice.error) {
					return cb("ERROR: Cannot get gas price");
				}
				tx.gasPrice = gasPrice;
				
				var etx = new ethTx(tx);
				var totalEther = shares * limitPrice;
				cb([{
					action: "BID",
					fee: etx.getUpfrontCost().toNumber(),
					totalEther: totalEther,
					avgPrice: totalEther / shares
				}]);
			});
		}
	}
};