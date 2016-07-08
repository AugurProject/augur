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
 * @param {Number} orderShares
 * @param {Number} orderLimitPrice
 * @param {String} takerFee Decimal string ("0.02" for 2% fee)
 * @param {String} makerFee Decimal string ("0.02" for 2% fee)
 * @param {String} userAddress Address of trader to exclude orders from order book
 * @param {Number} userPositionShares
 * @param {String} outcomeId
 * @param {Object} marketOrderBook Bids and asks for market (mixed for all outcomes)
 * @return {Array}
 */
module.exports = function getTradingActions(type, orderShares, orderLimitPrice, takerFee, makerFee, userAddress, userPositionShares, outcomeId, marketOrderBook) {
	if (type.constructor === Object && type.type) {
		orderShares = type.orderShares;
		orderLimitPrice = type.orderLimitPrice;
		takerFee = type.takerFee;
		makerFee = type.makerFee;
		userAddress = type.userAddress;
		userPositionShares = type.userPositionShares;
		outcomeId = type.outcomeId;
		marketOrderBook = type.marketOrderBook;
		type = type.type;
	}

	orderShares = new BigNumber(orderShares, 10);
	orderLimitPrice = new BigNumber(orderLimitPrice, 10);
	takerFee = new BigNumber(takerFee, 10);
	makerFee = new BigNumber(makerFee, 10);

	var augur = this;

	if (type === "buy") {
		var matchingSortedAsks = filterAndSortOrders(marketOrderBook.sell, type, orderLimitPrice, outcomeId, userAddress);

		var areSuitableOrders = matchingSortedAsks.length > 0;
		if (!areSuitableOrders) {
				return [getBidAction(orderShares, orderLimitPrice, makerFee, augur.rpc.gasPrice)];
		} else {
				var actions = [];

				var etherToTrade = constants.ZERO;
				var remainingShares = new BigNumber(orderShares, 10);
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
				actions.push(getBuyAction(etherToTrade, orderShares.minus(remainingShares), takerFee, augur.rpc.gasPrice));

				if (!isUserOrderFilled) {
					actions.push(getBidAction(remainingShares, orderLimitPrice, makerFee, augur.rpc.gasPrice));
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
	 * @param {BigNumber} makerFee
	 * @param {Number} gasPrice
	 * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
	 */
	function getBidAction(shares, limitPrice, makerFee, gasPrice) {
		var bidGasEth = getTxGasEth(clone(augur.tx.BuyAndSellShares.buy), gasPrice);
		var etherToBid = shares.times(limitPrice);
		return {
			action: "BID",
			shares: shares.toFixed(),
			gasEth: bidGasEth.toFixed(),
			feeEth: etherToBid.times(makerFee).toFixed(),
			costEth: etherToBid.toFixed(),
			avgPrice: limitPrice.toFixed()
		};
	}

	/**
	 *
	 * @param {BigNumber} buyEth
	 * @param {BigNumber} sharesFilled
	 * @param {BigNumber} takerFee
	 * @param {Number} gasPrice
	 * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
	 */
	function getBuyAction(buyEth, sharesFilled, takerFee, gasPrice) {
		var tradeGasEth = getTxGasEth(clone(augur.tx.Trade.trade), gasPrice);
		return {
			action: "BUY",
			shares: sharesFilled.toFixed(),
			gasEth: tradeGasEth.toFixed(),
			feeEth: buyEth.times(takerFee).toFixed(),
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
