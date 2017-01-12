/**
 * generateOrderBook: convenience method for generating an initial order book
 * for a newly created market. generateOrderBook calculates the number of
 * orders to create, as well as the spacing between orders.
 *
 * @param {Object} p
 *     market: market ID
 *     liquidity: initial cash to be placed on the order book
 *     initialFairPrices: array of midpoints used for bid/offer prices when the market opens
 *     startingQuantity: number of shares in each order
 *     bestStartingQuantity: number of shares in best bid/offer orders (optional)
 *     priceWidth: spread between best bid/offer
 *     isSimulation: if falsy generate order book; otherwise pass basic info to onSimulate callback
 * @param {Object} cb
 *     onSimulate, onBuyCompleteSets, onSetupOutcome, onSetupOrder, onSuccess, onFailed
 *     (note: callbacks can also be properties of the p object)
 */

"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var constants = require("./constants");

module.exports = function (p, cb) {
  var self = this;
  var liquidity = abi.bignum(p.liquidity);
  var numOutcomes = p.initialFairPrices.length;
  var initialFairPrices = new Array(numOutcomes);
  for (var i = 0; i < numOutcomes; ++i) {
    initialFairPrices[i] = abi.bignum(p.initialFairPrices[i]);
  }
  var startingQuantity = abi.bignum(p.startingQuantity);
  var bestStartingQuantity = abi.bignum(p.bestStartingQuantity || p.startingQuantity);
  var halfPriceWidth = abi.bignum(p.priceWidth).dividedBy(new BigNumber(2));
  cb = cb || {};
  var onBuyCompleteSets = cb.onBuyCompleteSets || p.onBuyCompleteSets || this.utils.noop;
  var onSetupOutcome = cb.onSetupOutcome || p.onSetupOutcome || this.utils.noop;
  var onSetupOrder = cb.onSetupOrder || p.onSetupOrder || this.utils.noop;
  var onSuccess = cb.onSuccess || p.onSuccess || this.utils.noop;
  var onFailed = cb.onFailed || p.onFailed || this.utils.noop;
  this.getMarketInfo(p.market, null, function (marketInfo) {
    var minValue, maxValue;
    if (!marketInfo) return onFailed(self.errors.NO_MARKET_INFO);
    if (marketInfo.numOutcomes !== numOutcomes) {
      return onFailed(self.errors.WRONG_NUMBER_OF_OUTCOMES);
    }
    var scalarMinMax;
    if (marketInfo.type === "scalar") {
      minValue = abi.bignum(marketInfo.events[0].minValue);
      maxValue = abi.bignum(marketInfo.events[0].maxValue);
      scalarMinMax = {minValue: minValue, maxValue: maxValue};
    } else {
      minValue = new BigNumber(0);
      maxValue = new BigNumber(1);
    }

    var priceDepth = self.calculatePriceDepth(liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue);
    if (priceDepth.lte(constants.ZERO) || priceDepth.toNumber() === Infinity) {
      return onFailed(self.errors.INSUFFICIENT_LIQUIDITY);
    }
    var buyPrices = new Array(numOutcomes);
    var sellPrices = new Array(numOutcomes);
    var numSellOrders = new Array(numOutcomes);
    var numBuyOrders = new Array(numOutcomes);
    var shares = new BigNumber(0);
    var i, j, buyPrice, sellPrice, outcomeShares;
    for (i = 0; i < numOutcomes; ++i) {
      if (initialFairPrices[i].lt(minValue.plus(halfPriceWidth)) ||
          initialFairPrices[i].gt(maxValue.minus(halfPriceWidth))) {
            console.log("priceDepth:", priceDepth.toFixed());
            console.log("initialFairPrice[" + i + "]:", initialFairPrices[i].toFixed());
            console.log("minValue:", minValue.toFixed());
            console.log("maxValue:", maxValue.toFixed());
            console.log("halfPriceWidth:", halfPriceWidth.toFixed());
            console.log("minValue + halfPriceWidth:", minValue.plus(halfPriceWidth).toFixed());
            console.log("maxValue - halfPriceWidth:", maxValue.minus(halfPriceWidth).toFixed());
            console.log(initialFairPrices[i].lt(minValue.plus(halfPriceWidth)), initialFairPrices[i].gt(maxValue.minus(halfPriceWidth)));
            return onFailed(self.errors.INITIAL_PRICE_OUT_OF_BOUNDS);
          }
      if (initialFairPrices[i].plus(halfPriceWidth).gte(maxValue) ||
        initialFairPrices[i].minus(halfPriceWidth).lte(minValue)) {
          return onFailed(self.errors.PRICE_WIDTH_OUT_OF_BOUNDS);
        }
      buyPrice = initialFairPrices[i].minus(halfPriceWidth);
      sellPrice = initialFairPrices[i].plus(halfPriceWidth);
      numBuyOrders[i] = buyPrice.minus(minValue).dividedBy(priceDepth).floor().toNumber();
      if (numBuyOrders[i] === 0) numBuyOrders[i] = 1;
      numSellOrders[i] = maxValue.minus(sellPrice).dividedBy(priceDepth).floor();
      if (numSellOrders[i].eq(new BigNumber(0))) numSellOrders[i] = new BigNumber(1);
      outcomeShares = bestStartingQuantity.plus(startingQuantity.times(numSellOrders[i]));
      if (outcomeShares.gt(shares)) shares = outcomeShares;
      numSellOrders[i] = numSellOrders[i].toNumber();
      buyPrices[i] = new Array(numBuyOrders[i]);
      buyPrices[i][0] = buyPrice;
      for (j = 1; j < numBuyOrders[i]; ++j) {
        buyPrices[i][j] = buyPrices[i][j - 1].minus(priceDepth);
        if (buyPrices[i][j].lte(minValue)) {
          buyPrices[i][j] = minValue.plus(priceDepth.dividedBy(new BigNumber(10)));
        }
      }
      sellPrices[i] = new Array(numSellOrders[i]);
      sellPrices[i][0] = sellPrice;
      for (j = 1; j < numSellOrders[i]; ++j) {
        sellPrices[i][j] = sellPrices[i][j - 1].plus(priceDepth);
        if (sellPrices[i][j].gte(maxValue)) {
          sellPrices[i][j] = maxValue.minus(priceDepth.dividedBy(new BigNumber(10)));
        }
      }
    }
    var numTransactions = 0;
    for (i = 0; i < numOutcomes; ++i) {
      numTransactions += numBuyOrders[i] + numSellOrders[i] + 3;
    }
    var onSimulate = cb.onSimulate || p.onSimulate;
    if (self.utils.is_function(onSimulate)) {
      onSimulate({
        shares: shares.toFixed(),
        numBuyOrders: numBuyOrders,
        numSellOrders: numSellOrders,
        buyPrices: abi.string(buyPrices),
        sellPrices: abi.string(sellPrices),
        numTransactions: numTransactions,
        priceDepth: priceDepth.toFixed()
      });
      if (p.isSimulation) return;
    }
    self.buyCompleteSets({
      market: p.market,
      amount: abi.hex(shares),
      onSent: function (res) {
        // console.log("generateOrderBook.buyCompleteSets sent:", res);
      },
      onSuccess: function (res) {
        // console.log("generateOrderBook.buyCompleteSets success:", res);
        onBuyCompleteSets(res);
        var outcomes = new Array(numOutcomes);
        for (var i = 0; i < numOutcomes; ++i) {
          outcomes[i] = i + 1;
        }
        async.forEachOfLimit(outcomes, constants.PARALLEL_LIMIT, function (outcome, index, nextOutcome) {
          async.parallelLimit([
            function (callback) {
              async.forEachOfLimit(buyPrices[index], constants.PARALLEL_LIMIT, function (buyPrice, i, nextBuyPrice) {
                var amount = (!i) ? bestStartingQuantity : startingQuantity;
                self.buy({
                  amount: amount.toFixed(),
                  price: buyPrice,
                  market: p.market,
                  outcome: outcome,
                  scalarMinMax: scalarMinMax,
                  onSent: function (res) {
                    // console.log("generateOrderBook.buy", amount.toFixed(), buyPrice, outcome, "sent:", res);
                  },
                  onSuccess: function (res) {
                    // console.log("generateOrderBook.buy", amount.toFixed(), buyPrice, outcome, "success:", res);
                    onSetupOrder({
                        tradeId: res.callReturn,
                        market: p.market,
                        outcome: outcome,
                        amount: amount.toFixed(),
                        buyPrice: buyPrice,
                        timestamp: res.timestamp,
                        hash: res.hash,
                        gasUsed: res.gasUsed
                      });
                    nextBuyPrice();
                  },
                  onFailed: function (err) {
                    console.error("generateOrderBook.buy", amount.toFixed(), buyPrice, outcome, "failed:", err);
                    nextBuyPrice(err);
                  }
                });
              }, function (err) {
                if (err) console.error("async.each buy:", err);
                callback(err);
              });
            },
            function (callback) {
              async.forEachOfLimit(sellPrices[index], constants.PARALLEL_LIMIT, function (sellPrice, i, nextSellPrice) {
                var amount = (!i) ? bestStartingQuantity : startingQuantity;
                self.sell({
                  amount: amount.toFixed(),
                  price: sellPrice,
                  market: p.market,
                  outcome: outcome,
                  scalarMinMax: scalarMinMax,
                  onSent: function (res) {
                    // console.log("generateOrderBook.sell", amount.toFixed(), sellPrice, outcome, "sent:", res);
                  },
                  onSuccess: function (res) {
                    // console.log("generateOrderBook.sell", amount.toFixed(), sellPrice, outcome, "success:", res);
                    onSetupOrder({
                        tradeId: res.callReturn,
                        market: p.market,
                        outcome: outcome,
                        amount: amount.toFixed(),
                        sellPrice: sellPrice,
                        timestamp: res.timestamp,
                        hash: res.hash,
                        gasUsed: res.gasUsed
                      });
                    nextSellPrice();
                  },
                  onFailed: function (err) {
                    console.error("generateOrderBook.sell", amount.toFixed(), sellPrice, outcome, "failed:", err);
                    nextSellPrice(err);
                  }
                });
              }, function (err) {
                if (err) console.error("async.each sell:", err);
                callback(err);
              });
            }
          ], constants.PARALLEL_LIMIT, function (err) {
            // if (err) console.error("buy/sell:", err);
            onSetupOutcome({market: p.market, outcome: outcome});
            nextOutcome(err);
          });
        }, function (err) {
          if (err) return onFailed(err);
          var scalarMinMax = {};
          if (marketInfo.type === "scalar") {
            scalarMinMax.minValue = minValue;
            scalarMinMax.maxValue = maxValue;
          }
          self.getOrderBook(p.market, scalarMinMax, onSuccess);
        });
      },
      onFailed: function (err) {
        console.error("generateOrderBook.buyCompleteSets failed:", err);
        onFailed(err);
      }
    });
  });
};
