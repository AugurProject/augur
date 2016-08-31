/*
 * Author: priecint
 */
var clone = require("clone");
var BigNumber = require("bignumber.js");
var EthTx = require("ethereumjs-tx");
var constants = require("../constants");
var abacus = require("./abacus");

BigNumber.config({
    MODULO_MODE: BigNumber.EUCLID,
    ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

var ONE = new BigNumber(1, 10);

module.exports = {

    /**
     * Calculates (approximately) gas needed to run the transaction
     *
     * @param {Object} tx
     * @param {Number} gasPrice
     * @return {BigNumber}
     */
    getTxGasEth: function (tx, gasPrice) {
        tx.gasLimit = tx.gas || constants.DEFAULT_GAS;
        tx.gasPrice = gasPrice;
        var etx = new EthTx(tx);
        // TODO replace getUpfrontCost w/ eth_estimateGas RPC
        return new BigNumber(etx.getUpfrontCost().toString(), 10).dividedBy(constants.ETHER);
    },

    /**
     * Bids are sorted descendingly, asks are sorted ascendingly
     *
     * @param {Array} orders Bids or asks
     * @param {String} traderOrderType What trader want to do (buy or sell)
     * @param {BigNumber=} limitPrice When buying it's max price to buy at, when selling it min price to sell at. If
     *     it's null order is considered to be market order
     * @param {String} outcomeId
     * @param {String} userAddress
     * @return {Array.<Object>}
     */
    filterByPriceAndOutcomeAndUserSortByPrice: function (orders, traderOrderType, limitPrice, outcomeId, userAddress) {
        var isMarketOrder = limitPrice === null || limitPrice === undefined;
        return Object.keys(orders)
            .map(function (orderId) {
                return orders[orderId];
            })
            .filter(function (order) {
                var isMatchingPrice;
                if (isMarketOrder) {
                    isMatchingPrice = true;
                } else {
                    isMatchingPrice = traderOrderType === "buy" ? new BigNumber(order.price, 10).lte(limitPrice) : new BigNumber(order.price, 10).gte(limitPrice);
                }
                return order.outcome === outcomeId && order.owner !== userAddress && isMatchingPrice;
            })
            .sort(function compareOrdersByPrice(order1, order2) {
                return traderOrderType === "buy" ? order1.price - order2.price : order2.price - order1.price;
            });
    },

    /**
     *
     * @param {BigNumber} shares
     * @param {BigNumber} limitPrice
     * @param {BigNumber} makerFee
     * @param {Number} gasPrice
     * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
     */
    getBidAction: function (shares, limitPrice, makerFee, gasPrice) {
        var bidGasEth = this.getTxGasEth(clone(this.tx.BuyAndSellShares.buy), gasPrice);
        var etherToBid = shares.times(limitPrice);
        return {
            action: "BID",
            shares: shares.toFixed(),
            gasEth: bidGasEth.toFixed(),
            feeEth: etherToBid.times(makerFee).toFixed(),
            costEth: etherToBid.toFixed(),
            avgPrice: limitPrice.toFixed()
        };
    },

    /**
     *
     * @param {BigNumber} buyEth
     * @param {BigNumber} sharesFilled
     * @param {BigNumber} takerFeeEth
     * @param {Number} gasPrice
     * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
     */
    getBuyAction: function (buyEth, sharesFilled, takerFeeEth, gasPrice) {
        var tradeGasEth = this.getTxGasEth(clone(this.tx.Trade.trade), gasPrice);
        return {
            action: "BUY",
            shares: sharesFilled.toFixed(),
            gasEth: tradeGasEth.toFixed(),
            feeEth: takerFeeEth.toFixed(),
            costEth: buyEth.toFixed(),
            avgPrice: buyEth.dividedBy(sharesFilled).toFixed()
        };
    },

    /**
     *
     * @param {BigNumber} shares
     * @param {BigNumber} limitPrice
     * @param {BigNumber} makerFee
     * @param {Number} gasPrice
     * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
     */
    getAskAction: function (shares, limitPrice, makerFee, gasPrice) {
        var askGasEth = this.getTxGasEth(clone(this.tx.BuyAndSellShares.sell), gasPrice);
        var costEth = shares.times(limitPrice);
        return {
            action: "ASK",
            shares: shares.toFixed(),
            gasEth: askGasEth.toFixed(),
            feeEth: costEth.times(makerFee).toFixed(),
            costEth: costEth.toFixed(),
            avgPrice: limitPrice.toFixed()
        };
    },

    /**
     *
     * @param {BigNumber} sellEth
     * @param {BigNumber} sharesFilled
     * @param {BigNumber} takerFeeEth
     * @param {Number} gasPrice
     * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
     */
    getSellAction: function (sellEth, sharesFilled, takerFeeEth, gasPrice) {
        var tradeGasEth = this.getTxGasEth(clone(this.tx.Trade.trade), gasPrice);
        return {
            action: "SELL",
            shares: sharesFilled.toFixed(),
            gasEth: tradeGasEth.toFixed(),
            feeEth: takerFeeEth.toFixed(),
            costEth: sellEth.toFixed(),
            avgPrice: sellEth.dividedBy(sharesFilled).toFixed()
        };
    },

    /**
     *
     * @param {BigNumber} shortSellEth
     * @param {BigNumber} shares
     * @param {BigNumber} takerFeeEth
     * @param {Number} gasPrice
     * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
     */
    getShortSellAction: function (shortSellEth, shares, takerFeeEth, gasPrice) {
        var shortSellGasEth = this.getTxGasEth(clone(this.tx.Trade.short_sell), gasPrice);
        var costEth = shortSellEth.minus(shares);
        return {
            action: "SHORT_SELL",
            shares: shares.toFixed(),
            gasEth: shortSellGasEth.toFixed(),
            feeEth: takerFeeEth.toFixed(),
            costEth: costEth.toFixed(),
            avgPrice: shortSellEth.dividedBy(shares).toFixed()
        };
    },

    /**
     *
     * @param {BigNumber} shares
     * @param {BigNumber} limitPrice
     * @param {BigNumber} makerFee
     * @param {Number} gasPrice
     * @return {{action: string, shares: string, gasEth: string, feeEth: string, costEth: string, avgPrice: string}}
     */
    getShortAskAction: function (shares, limitPrice, makerFee, gasPrice) {
        var buyCompleteSetsGasEth = this.getTxGasEth(clone(this.tx.CompleteSets.buyCompleteSets), gasPrice);
        var askGasEth = this.getTxGasEth(clone(this.tx.BuyAndSellShares.sell), gasPrice);
        var shortAskEth = shares.times(limitPrice);
        var costEth = shortAskEth.minus(shares);
        return {
            action: "SHORT_ASK",
            shares: shares.toFixed(),
            gasEth: buyCompleteSetsGasEth.plus(askGasEth).toFixed(),
            feeEth: shortAskEth.times(makerFee).toFixed(),
            costEth: costEth.toFixed(),
            avgPrice: limitPrice.toFixed()
        };
    },

    /**
     * Allows to estimate what trading methods will be called based on user's order. This is useful so users know how
     * much they pay for trading
     *
     * @param {String} type 'buy' or 'sell'
     * @param {String|BigNumber} orderShares
     * @param {String|BigNumber=} orderLimitPrice null value results in market order
     * @param {String|BigNumber} takerFee Decimal string ("0.02" for 2% fee)
     * @param {String|BigNumber} makerFee Decimal string ("0.02" for 2% fee)
     * @param {String} userAddress Address of trader to exclude orders from order book
     * @param {String|BigNumber} userPositionShares
     * @param {String} outcomeId
     * @param {Object} marketOrderBook Bids and asks for market (mixed for all outcomes)
     * @return {Array}
     */
    getTradingActions: function (type, orderShares, orderLimitPrice, takerFee, makerFee, userAddress, userPositionShares, outcomeId, range, marketOrderBook) {
        var remainingOrderShares, i, length, orderSharesFilled, bid, ask, bidAmount, isMarketOrder, fees, adjustedFees, bnPrice, totalTakerFeeEth;
        if (type.constructor === Object && type.type) {
            orderShares = type.orderShares;
            orderLimitPrice = type.orderLimitPrice;
            takerFee = type.takerFee;
            makerFee = type.makerFee;
            userAddress = type.userAddress;
            userPositionShares = type.userPositionShares;
            outcomeId = type.outcomeId;
            marketOrderBook = type.marketOrderBook;
            range = type.range;
            type = type.type;
        }

        orderShares = new BigNumber(orderShares, 10);
        orderLimitPrice = (orderLimitPrice === null || orderLimitPrice === undefined) ? null : new BigNumber(orderLimitPrice, 10);
        var bnTakerFee = new BigNumber(takerFee, 10);
        var bnMakerFee = new BigNumber(makerFee, 10);
        var bnRange = new BigNumber(range, 10);
        userPositionShares = new BigNumber(userPositionShares, 10);
        isMarketOrder = orderLimitPrice === null || orderLimitPrice === undefined;
        fees = abacus.calculateTradingFees(bnMakerFee, bnTakerFee);
        if (!isMarketOrder) {
            adjustedFees = abacus.calculateMakerTakerFees(abacus.calculateAdjustedTradingFee(fees.tradingFee, orderLimitPrice, bnRange), fees.makerProportionOfFee, true, true);
        }

        var augur = this;
        var gasPrice = augur.rpc.gasPrice;
        if (type === "buy") {
            var matchingSortedAsks = augur.filterByPriceAndOutcomeAndUserSortByPrice(marketOrderBook.sell, type, orderLimitPrice, outcomeId, userAddress);
            var areSuitableOrders = matchingSortedAsks.length > 0;
            if (!areSuitableOrders) {
                if (isMarketOrder) {
                    return [];
                }
                return [augur.getBidAction(orderShares, orderLimitPrice, adjustedFees.maker, gasPrice)];
            } else {
                var buyActions = [];

                var etherToTrade = constants.ZERO;
                totalTakerFeeEth = constants.ZERO;
                remainingOrderShares = orderShares;
                length = matchingSortedAsks.length;
                for (i = 0; i < length; i++) {
                    ask = matchingSortedAsks[i];
                    orderSharesFilled = BigNumber.min(remainingOrderShares, ask.amount);
                    bnPrice = new BigNumber(ask.price, 10);
                    etherToTrade = etherToTrade.add(orderSharesFilled.times(bnPrice));
                    totalTakerFeeEth = totalTakerFeeEth.plus(abacus.calculateMakerTakerFees(abacus.calculateAdjustedTradingFee(fees.tradingFee, bnPrice, bnRange), fees.makerProportionOfFee, true, true).taker);
                    remainingOrderShares = remainingOrderShares.minus(orderSharesFilled);
                    if (remainingOrderShares.equals(constants.ZERO)) {
                        break;
                    }
                }
                buyActions.push(augur.getBuyAction(etherToTrade, orderShares.minus(remainingOrderShares), totalTakerFeeEth, gasPrice));

                if (!remainingOrderShares.equals(constants.ZERO) && !isMarketOrder) {
                    buyActions.push(augur.getBidAction(remainingOrderShares, orderLimitPrice, adjustedFees.maker, gasPrice));
                }

                return buyActions;
            }
        } else {
            var matchingSortedBids = augur.filterByPriceAndOutcomeAndUserSortByPrice(marketOrderBook.buy, type, orderLimitPrice, outcomeId, userAddress);

            var areSuitableBids = matchingSortedBids.length > 0;
            var userHasPosition = userPositionShares.greaterThan(constants.ZERO);
            var sellActions = [];

            if (userHasPosition) {
                var etherToSell = constants.ZERO;
                remainingOrderShares = orderShares;
                var remainingPositionShares = userPositionShares;
                if (areSuitableBids) {
                    totalTakerFeeEth = constants.ZERO;
                    for (i = 0, length = matchingSortedBids.length; i < length; i++) {
                        bid = matchingSortedBids[i];
                        bidAmount = new BigNumber(bid.amount);
                        bnPrice = new BigNumber(bid.price, 10);
                        orderSharesFilled = BigNumber.min(bidAmount, remainingOrderShares, remainingPositionShares);
                        etherToSell = etherToSell.plus(orderSharesFilled.times(bnPrice));
                        remainingOrderShares = remainingOrderShares.minus(orderSharesFilled);
                        remainingPositionShares = remainingPositionShares.minus(orderSharesFilled);
                        if (orderSharesFilled.equals(bidAmount)) {
                            // since this order is filled we remove it. Change for-cycle variables accordingly
                            matchingSortedBids.splice(i, 1);
                            i--;
                            length--;
                        } else {
                            var newBid = clone(bid);
                            newBid.amount = bidAmount.minus(orderSharesFilled).toFixed();
                            matchingSortedBids[i] = newBid;
                        }
                        totalTakerFeeEth = totalTakerFeeEth.plus(abacus.calculateMakerTakerFees(abacus.calculateAdjustedTradingFee(fees.tradingFee, bnPrice, bnRange), fees.makerProportionOfFee, true, true).taker);
                        if (remainingOrderShares.equals(constants.ZERO) || remainingPositionShares.equals(constants.ZERO)) {
                            break;
                        }
                    }

                    sellActions.push(augur.getSellAction(etherToSell, orderShares.minus(remainingOrderShares), totalTakerFeeEth, gasPrice));
                } else {
                    if (!isMarketOrder) {
                        var askShares = BigNumber.min(remainingOrderShares, remainingPositionShares);
                        remainingOrderShares = remainingOrderShares.minus(askShares);
                        remainingPositionShares = remainingPositionShares.minus(askShares);
                        sellActions.push(augur.getAskAction(askShares, orderLimitPrice, adjustedFees.maker, gasPrice));
                    }
                }

                if (remainingOrderShares.greaterThan(constants.ZERO) && !isMarketOrder) {
                    // recursion
                    sellActions = sellActions.concat(augur.getTradingActions(type, remainingOrderShares, orderLimitPrice, takerFee, makerFee, userAddress, remainingPositionShares, outcomeId, range, {buy: matchingSortedBids}));
                }
            } else {
                if (isMarketOrder) {
                    return sellActions;
                }

                var etherToShortSell = constants.ZERO;
                remainingOrderShares = orderShares;
                if (areSuitableBids) {
                    totalTakerFeeEth = constants.ZERO;
                    for (i = 0, length = matchingSortedBids.length; i < length; i++) {
                        bid = matchingSortedBids[i];
                        bnPrice = new BigNumber(bid.price, 10);
                        orderSharesFilled = BigNumber.min(new BigNumber(bid.amount, 10), remainingOrderShares);
                        etherToShortSell = etherToShortSell.plus(orderSharesFilled.times(bnPrice));
                        totalTakerFeeEth = totalTakerFeeEth.plus(abacus.calculateMakerTakerFees(abacus.calculateAdjustedTradingFee(fees.tradingFee, bnPrice, bnRange), fees.makerProportionOfFee, true, true).taker);
                        remainingOrderShares = remainingOrderShares.minus(orderSharesFilled);
                        if (remainingOrderShares.equals(constants.ZERO)) {
                            break;
                        }
                    }
                    sellActions.push(augur.getShortSellAction(etherToShortSell, orderShares.minus(remainingOrderShares), totalTakerFeeEth, gasPrice));
                }
                if (remainingOrderShares.greaterThan(constants.ZERO)) {
                    sellActions.push(augur.getShortAskAction(remainingOrderShares, orderLimitPrice, adjustedFees.maker, gasPrice));
                }
            }

            return sellActions;
        }
    }
};
