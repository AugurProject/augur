/*
 * Author: priecint
 */
var clone = require("clone");
var BigNumber = require("bignumber.js");
var EthTx = require("ethereumjs-tx");
var abi = require("augur-abi");
var constants = require("../constants");
var abacus = require("./abacus");

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
    return new BigNumber(etx.getUpfrontCost().toString(), 10).dividedBy(constants.ETHER);
  },

  /**
   * Bids are sorted descendingly, asks are sorted ascendingly
   *
   * @param {Array} orders Bids or asks
   * @param {String} traderOrderType What trader want to do (buy or sell)
   * @param {BigNumber=} limitPrice When buying it's max price to buy at, when selling it min price to sell at. If it's null order is considered to be market order
   * @param {String} outcomeId
   * @param {String} userAddress
   * @return {Array.<Object>}
   */
  filterByPriceAndOutcomeAndUserSortByPrice: function (orders, traderOrderType, limitPrice, outcomeId, userAddress) {
    if (!orders) return [];
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
    var etherToBid = shares.times(limitPrice).dividedBy(constants.ONE).floor();
    var feeEth = etherToBid.times(makerFee).dividedBy(constants.ONE).floor();
    return {
      action: "BID",
      shares: abi.unfix(shares, "string"),
      gasEth: bidGasEth.toFixed(),
      feeEth: abi.unfix(feeEth, "string"),
      feePercent: abi.unfix(makerFee).times(100).toFixed(),
      costEth: abi.unfix(etherToBid.plus(feeEth), "string"),
      avgPrice: abi.unfix(etherToBid.plus(feeEth).dividedBy(shares).times(constants.ONE).floor(), "string"),
      noFeePrice: abi.unfix(limitPrice, "string")
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
    var fxpBuyEth = abi.fix(buyEth);
    var fxpTakerFeeEth = abi.fix(takerFeeEth);
    var fxpSharesFilled = abi.fix(sharesFilled);
    return {
      action: "BUY",
      shares: sharesFilled.toFixed(),
      gasEth: tradeGasEth.toFixed(),
      feeEth: takerFeeEth.toFixed(),
      feePercent: abi.unfix(fxpTakerFeeEth.dividedBy(fxpBuyEth).times(constants.ONE).floor().times(100), "string"),
      costEth: buyEth.toFixed(),
      avgPrice: abi.unfix(fxpBuyEth.dividedBy(fxpSharesFilled).times(constants.ONE).floor(), "string"),
      noFeePrice: abi.unfix(fxpBuyEth.minus(fxpTakerFeeEth).dividedBy(fxpSharesFilled).times(constants.ONE).floor(), "string")
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
    var costEth = shares.times(limitPrice).dividedBy(constants.ONE).floor();
    var feeEth = costEth.times(makerFee).dividedBy(constants.ONE).floor();
    return {
      action: "ASK",
      shares: abi.unfix(shares, "string"),
      gasEth: askGasEth.toFixed(),
      feeEth: abi.unfix(feeEth, "string"),
      feePercent: abi.unfix(makerFee).times(100).toFixed(),
      costEth: abi.unfix(costEth.minus(feeEth), "string"),
      avgPrice: abi.unfix(costEth.minus(feeEth).dividedBy(shares).times(constants.ONE).floor(), "string"),
      noFeePrice: abi.unfix(limitPrice, "string")
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
    var fxpSellEth = abi.fix(sellEth);
    var fxpSharesFilled = abi.fix(sharesFilled);
    var fxpTakerFeeEth = abi.fix(takerFeeEth);
    return {
      action: "SELL",
      shares: sharesFilled.toFixed(),
      gasEth: tradeGasEth.toFixed(),
      feeEth: takerFeeEth.toFixed(),
      feePercent: abi.unfix(fxpTakerFeeEth.dividedBy(fxpSellEth).times(constants.ONE).floor().times(100), "string"),
      costEth: sellEth.toFixed(),
      avgPrice: abi.unfix(fxpSellEth.dividedBy(fxpSharesFilled).times(constants.ONE).floor(), "string"),
      noFeePrice: abi.unfix(fxpSellEth.plus(fxpTakerFeeEth).dividedBy(fxpSharesFilled).times(constants.ONE).floor(), "string")
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
    var fxpShortSellEth = abi.fix(shortSellEth);
    var fxpTakerFeeEth = abi.fix(takerFeeEth);
    var fxpShares = abi.fix(shares);
    return {
      action: "SHORT_SELL",
      shares: shares.toFixed(),
      gasEth: shortSellGasEth.toFixed(),
      feeEth: takerFeeEth.toFixed(),
      feePercent: abi.unfix(fxpTakerFeeEth.dividedBy(fxpShortSellEth).times(constants.ONE).floor().times(100), "string"),
      costEth: shortSellEth.toFixed(),
      avgPrice: abi.unfix(fxpShortSellEth.dividedBy(fxpShares).times(constants.ONE).floor(), "string"),
      noFeePrice: abi.unfix(fxpShortSellEth.plus(fxpTakerFeeEth).dividedBy(fxpShares).times(constants.ONE).floor(), "string")
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
    var feeEth = shares.times(limitPrice).dividedBy(constants.ONE).floor().times(makerFee).dividedBy(constants.ONE).floor();
    // var costEth = shares.neg().minus(feeEth).plus(shares.times(limitPrice));
    var costEth = shares.neg().minus(feeEth);
    return {
      action: "SHORT_ASK",
      shares: abi.unfix(shares, "string"),
      gasEth: buyCompleteSetsGasEth.plus(askGasEth).toFixed(),
      feeEth: abi.unfix(feeEth, "string"),
      feePercent: abi.unfix(makerFee).times(100).toFixed(),
      costEth: abi.unfix(costEth, "string"),
      avgPrice: abi.unfix(costEth.neg().dividedBy(shares).times(constants.ONE).floor(), "string"),
      noFeePrice: abi.unfix(limitPrice, "string") // "limit price" (not really no fee price)
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
   * @param {Object} scalarMinMax {minValue, maxValue} if scalar, null otherwise
   * @return {Array}
   */
  getTradingActions: function (type, orderShares, orderLimitPrice, takerFee, makerFee, userAddress, userPositionShares, outcomeId, range, marketOrderBook, scalarMinMax) {
    var remainingOrderShares, i, length, orderSharesFilled, bid, ask, bidAmount, isMarketOrder, fees, adjustedFees, totalTakerFeeEth;
    if (type.constructor === Object) {
      orderShares = type.orderShares;
      orderLimitPrice = type.orderLimitPrice;
      takerFee = type.takerFee;
      makerFee = type.makerFee;
      userAddress = type.userAddress;
      userPositionShares = type.userPositionShares;
      outcomeId = type.outcomeId;
      marketOrderBook = type.marketOrderBook;
      range = type.range;
      scalarMinMax = type.scalarMinMax;
      type = type.type;
    }

    userAddress = abi.format_address(userAddress);
    orderShares = new BigNumber(orderShares, 10);
    orderLimitPrice = (orderLimitPrice === null || orderLimitPrice === undefined) ?
      null :
      new BigNumber(orderLimitPrice, 10);
    var bnTakerFee = new BigNumber(takerFee, 10);
    var bnMakerFee = new BigNumber(makerFee, 10);
    var bnRange = new BigNumber(range, 10);
    userPositionShares = new BigNumber(userPositionShares, 10);
    isMarketOrder = orderLimitPrice === null || orderLimitPrice === undefined;
    fees = abacus.calculateFxpTradingFees(bnMakerFee, bnTakerFee);
    if (!isMarketOrder) {
      adjustedFees = abacus.calculateFxpMakerTakerFees(
        abacus.calculateFxpAdjustedTradingFee(
          fees.tradingFee,
          abi.fix(orderLimitPrice),
          abi.fix(bnRange)
        ),
        fees.makerProportionOfFee,
        false,
        true
      );
    }

    var augur = this;
    var gasPrice = augur.rpc.gasPrice;
    var tradingCost, fullPrecisionPrice;
    if (type === "buy") {
      var matchingSortedAsks = augur.filterByPriceAndOutcomeAndUserSortByPrice(marketOrderBook.sell, type, orderLimitPrice, outcomeId, userAddress);
      var areSuitableOrders = matchingSortedAsks.length > 0;
      if (!areSuitableOrders) {
        if (isMarketOrder) {
          return [];
        }
        return [augur.getBidAction(abi.fix(orderShares), abi.fix(orderLimitPrice), adjustedFees.maker, gasPrice)];
      } else {
        var buyActions = [];

        var etherToTrade = constants.ZERO;
        totalTakerFeeEth = constants.ZERO;
        remainingOrderShares = orderShares;
        length = matchingSortedAsks.length;
        for (i = 0; i < length; i++) {
          ask = matchingSortedAsks[i];
          orderSharesFilled = BigNumber.min(remainingOrderShares, ask.amount);
          fullPrecisionPrice = (scalarMinMax && scalarMinMax.minValue) ?
            abacus.shrinkScalarPrice(scalarMinMax.minValue, ask.fullPrecisionPrice) :
            ask.fullPrecisionPrice;
          tradingCost = abacus.calculateFxpTradingCost(orderSharesFilled, fullPrecisionPrice, fees.tradingFee, fees.makerProportionOfFee, range);
          totalTakerFeeEth = totalTakerFeeEth.plus(tradingCost.fee);
          etherToTrade = etherToTrade.plus(tradingCost.cost);
          remainingOrderShares = remainingOrderShares.minus(orderSharesFilled);
          if (remainingOrderShares.lte(constants.PRECISION.zero)) {
            break;
          }
        }
        buyActions.push(augur.getBuyAction(etherToTrade, orderShares.minus(remainingOrderShares), totalTakerFeeEth, gasPrice));

        if (!remainingOrderShares.lte(constants.PRECISION.zero) && !isMarketOrder) {
          buyActions.push(augur.getBidAction(abi.fix(remainingOrderShares), abi.fix(orderLimitPrice), adjustedFees.maker, gasPrice));
        }

        return buyActions;
      }
    } else {
      var matchingSortedBids = augur.filterByPriceAndOutcomeAndUserSortByPrice(marketOrderBook.buy, type, orderLimitPrice, outcomeId, userAddress);

      var areSuitableBids = matchingSortedBids.length > 0;
      var userHasPosition = userPositionShares.gt(constants.PRECISION.zero);
      var sellActions = [];

      if (userHasPosition) {
        var etherToSell = constants.ZERO;
        remainingOrderShares = orderShares;
        var remainingPositionShares = userPositionShares;
        if (areSuitableBids) {
          totalTakerFeeEth = constants.ZERO;
          for (i = 0, length = matchingSortedBids.length; i < length; i++) {
            bid = matchingSortedBids[i];
            bidAmount = new BigNumber(bid.amount, 10);
            orderSharesFilled = BigNumber.min(bidAmount, remainingOrderShares, remainingPositionShares);
            fullPrecisionPrice = (scalarMinMax && scalarMinMax.minValue) ?
              abacus.shrinkScalarPrice(scalarMinMax.minValue, bid.fullPrecisionPrice) :
              bid.fullPrecisionPrice;
            tradingCost = abacus.calculateFxpTradingCost(orderSharesFilled, fullPrecisionPrice, fees.tradingFee, fees.makerProportionOfFee, range);
            totalTakerFeeEth = totalTakerFeeEth.plus(tradingCost.fee);
            etherToSell = etherToSell.plus(tradingCost.cash);
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
            if (remainingOrderShares.lte(constants.PRECISION.zero) || remainingPositionShares.lte(constants.PRECISION.zero)) {
              break;
            }
          }
          sellActions.push(augur.getSellAction(etherToSell, orderShares.minus(remainingOrderShares), totalTakerFeeEth, gasPrice));
        } else {
          if (!isMarketOrder) {
            var askShares = BigNumber.min(remainingOrderShares, remainingPositionShares);
            remainingOrderShares = remainingOrderShares.minus(askShares);
            remainingPositionShares = remainingPositionShares.minus(askShares);
            sellActions.push(augur.getAskAction(abi.fix(askShares), abi.fix(orderLimitPrice), adjustedFees.maker, gasPrice));
          }
        }

        if (remainingOrderShares.gt(constants.PRECISION.zero) && !isMarketOrder) {
          // recursion
          sellActions = sellActions.concat(augur.getTradingActions(type, remainingOrderShares, orderLimitPrice, takerFee, makerFee, userAddress, remainingPositionShares, outcomeId, range, {buy: matchingSortedBids}, scalarMinMax));
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
            orderSharesFilled = BigNumber.min(new BigNumber(bid.amount, 10), remainingOrderShares);
            fullPrecisionPrice = (scalarMinMax && scalarMinMax.maxValue !== null && scalarMinMax.maxValue !== undefined) ?
                            abacus.adjustScalarSellPrice(scalarMinMax.maxValue, bid.fullPrecisionPrice) :
                            bid.fullPrecisionPrice;
            tradingCost = abacus.calculateFxpTradingCost(orderSharesFilled, fullPrecisionPrice, fees.tradingFee, fees.makerProportionOfFee, range);
            totalTakerFeeEth = totalTakerFeeEth.plus(tradingCost.fee);
            etherToShortSell = etherToShortSell.plus(tradingCost.cash);
            remainingOrderShares = remainingOrderShares.minus(orderSharesFilled);
            if (remainingOrderShares.lte(constants.PRECISION.zero)) {
              break;
            }
          }
          sellActions.push(augur.getShortSellAction(etherToShortSell, orderShares.minus(remainingOrderShares), totalTakerFeeEth, gasPrice));
        }
        if (remainingOrderShares.gt(constants.PRECISION.zero)) {
          sellActions.push(augur.getShortAskAction(abi.fix(remainingOrderShares), abi.fix(orderLimitPrice), adjustedFees.maker, gasPrice));
        }
      }

      return sellActions;
    }
  }
};
