/*
 * Author: priecint
 */
var ethTx = require("ethereumjs-tx");
var clone = require("clone");
var constants = require("../src/constants");
var BigNumber = require("bignumber.js");

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
	var augur = this;

	if (type === "buy") {
		var matchingSortedAsks = filterAndSortOrders(marketOrderBook.sell, type, limitPrice, outcomeId, userAddress);

		var areSuitableOrders = matchingSortedAsks.length > 0, tx;
		if (!areSuitableOrders) {
			tx = clone(augur.tx.BuyAndSellShares.buy);
			tx.gasLimit = tx.gas || constants.DEFAULT_GAS;
			augur.rpc.gasPrice(function (gasPrice) {
				if (!gasPrice || gasPrice.error) {
					return cb("ERROR: Cannot get gas price");
				}

				tx.gasPrice = gasPrice;
				var etx = new ethTx(tx);
				var fee = new BigNumber(etx.getUpfrontCost().toString(), 10).dividedBy(augur.rpc.ETHER);

				var etherToTrade = new BigNumber(shares * limitPrice, 10);
				cb([{
					action: "BID",
					feeEth: fee.toFixed(),
					totalEther: etherToTrade.add(fee).toFixed(),
					avgPrice: new BigNumber(limitPrice, 10).toFixed()
				}]);
			});
		} else {
			tx = clone(augur.tx.Trade.trade);
			tx.gasLimit = tx.gas || constants.DEFAULT_GAS;
			augur.rpc.gasPrice(function (gasPrice) {
				if (!gasPrice || gasPrice.error) {
					return cb("ERROR: Cannot get gas price");
				}

				tx.gasPrice = gasPrice;
				var etx = new ethTx(tx);
				var fee = etx.getUpfrontCost().toString();

				var userWantsToTradeEth = new BigNumber(shares * limitPrice, 10);
				var tradedEth = constants.ZERO;
				for (var i = 0, length = matchingSortedAsks.length; i < length; i++) {
					var order = matchingSortedAsks[i];
					var orderEthValue = new BigNumber(order.amount * order.price, 10);
					// todo
				}

				cb([{
					action: "BUY",
					feeEth: new BigNumber(fee, 10).dividedBy(augur.rpc.ETHER).toFixed(),
					totalEther: userWantsToTradeEth.add(fee).toFixed(),
					avgPrice: userWantsToTradeEth.dividedBy(new BigNumber(shares, 10)).toFixed()
				}]);
			});
		}
	}
};

/**
 *
 * @param {Array} orders
 * @param {String} type
 * @param {Number} limitPrice
 * @param {String} outcomeId
 * @param {String} userAddress
 */
function filterAndSortOrders(orders, type, limitPrice, outcomeId, userAddress) {
	return orders
		.filter(function filterOrdersByOutcomeAndOwnerAndPrice(order) {
			var isMatchingPrice = type === "buy" ? parseFloat(order.price) <= limitPrice : parseFloat(order.price) >= limitPrice;
			return order.outcome === outcomeId &&
				order.owner !== userAddress &&
				isMatchingPrice;
		})
		.sort(function compareOrdersByPrice(order1, order2) {
			return type === "buy" ? order1.price - order2.price : order2.price - order1.price;
		});
}