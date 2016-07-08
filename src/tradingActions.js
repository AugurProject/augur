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
 * @param {String} takerFee Decimal string ("0.02" for 2% fee)
 * @param {String} makerFee Decimal string ("0.02" for 2% fee)
 * @param {String} userAddress Address of trader to exclude orders from order book
 * @param {Number} userPositionShares
 * @param {String} outcomeId
 * @param {Object} marketOrderBook Bids and asks for market (mixed for all outcomes)
 * @return {Array}
 */
module.exports = function getTradingActions(type, shares, limitPrice, takerFee, makerFee, userAddress, userPositionShares, outcomeId, marketOrderBook) {
	if (type.constructor === Object && type.type) {
		shares = type.shares;
		limitPrice = type.limitPrice;
		takerFee = type.takerFee;
		makerFee = type.makerFee;
		userAddress = type.userAddress;
		userPositionShares = type.userPositionShares;
		outcomeId = type.outcomeId;
		marketOrderBook = type.marketOrderBook;
		type = type.type;
	}

	shares = new BigNumber(shares, 10);
	limitPrice = new BigNumber(limitPrice, 10);

	var augur = this;

	if (type === "buy") {
		var matchingSortedAsks = filterAndSortOrders(marketOrderBook.sell, type, limitPrice, outcomeId, userAddress);

		var areSuitableOrders = matchingSortedAsks.length > 0;
		if (!areSuitableOrders) {

				return [getBidAction(shares, limitPrice, augur.rpc.gasPrice)];
		} else {
				var actions = [];

				var etherToTrade = constants.ZERO;
				var remainingShares = new BigNumber(shares, 10);
				for (var i = 0, length = matchingSortedAsks.length; i < length; i++) {
					var order = matchingSortedAsks[i];
					var orderSharesFilled = BigNumber.min(remainingShares, order.amount);
					etherToTrade = etherToTrade.add(orderSharesFilled.times(new BigNumber(order.price, 10)));
					remainingShares = remainingShares.minus(orderSharesFilled);
					var isUserOrderFilled = remainingShares.equals(constants.ZERO);
					if (isUserOrderFilled) {
						break;
					}
				}
				actions.push(getBuyAction(etherToTrade, shares.minus(remainingShares), augur.rpc.gasPrice));

				if (!isUserOrderFilled) {
					actions.push(getBidAction(remainingShares, limitPrice, augur.rpc.gasPrice));
				}

				return actions;
		}
	} else {
		return ["todo"];
	}

	/**
	 *
	 * @param {Array} orders
	 * @param {String} type
	 * @param {BigNumber} limitPrice
	 * @param {String} outcomeId
	 * @param {String} userAddress
	 * @return {Array.<Object>}
	 */
	function filterAndSortOrders(orders, type, limitPrice, outcomeId, userAddress) {
		return orders
			.filter(function filterOrdersByOutcomeAndOwnerAndPrice(order) {
				var isMatchingPrice = type === "buy" ? new BigNumber(order.price, 10).lte(limitPrice) : new BigNumber(order.price, 10).gte(limitPrice);
				return order.outcome === outcomeId &&
					order.owner !== userAddress &&
					isMatchingPrice;
			})
			.sort(function compareOrdersByPrice(order1, order2) {
				return type === "buy" ? order1.price - order2.price : order2.price - order1.price;
			});
	}

	/**
	 *
	 * @param {BigNumber} shares
	 * @param {BigNumber} limitPrice
	 * @param {Number} gasPrice
	 * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
	 */
	function getBidAction(shares, limitPrice, gasPrice) {
		var bidGasEth = getTxGasEth(clone(augur.tx.BuyAndSellShares.buy), gasPrice);
		var etherToBid = shares.times(limitPrice);
		return {
			action: "BID",
			shares: shares.toFixed(),
			gasEth: bidGasEth.toFixed(),
			feeEth: "todo",
			costEth: etherToBid.toFixed(),
			avgPrice: limitPrice.toFixed()
		};
	}

	/**
	 *
	 * @param {BigNumber} buyEth
	 * @param {BigNumber} sharesFilled
	 * @param {Number} gasPrice
	 * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
	 */
	function getBuyAction(buyEth, sharesFilled, gasPrice) {
		var tradeGasEth = getTxGasEth(clone(augur.tx.Trade.trade), gasPrice);
		return {
			action: "BUY",
			shares: sharesFilled.toFixed(),
			gasEth: tradeGasEth.toFixed(),
			feeEth: "todo",
			costEth: buyEth.toFixed(),
			avgPrice: buyEth.dividedBy(sharesFilled).toFixed()
		};
	}

	/**
	 *
	 * @param {Object} tx
	 * @param {Number} gasPrice
	 * @return {BigNumber}
	 */
	function getTxGasEth(tx, gasPrice) {
		tx.gasLimit = tx.gas || constants.DEFAULT_GAS;
		tx.gasPrice = gasPrice;
		var etx = new ethTx(tx);
		return new BigNumber(etx.getUpfrontCost().toString(), 10).dividedBy(constants.ETHER);
	}
};
