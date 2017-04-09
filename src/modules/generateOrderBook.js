"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var constants = require("../constants");
var noop = require("../utils/noop");
var isFunction = require("../utils/is-function");

module.exports = {

  // expects BigNumber inputs
  calculatePriceDepth: function (liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue) {
    return startingQuantity.times(
      minValue.plus(maxValue).minus(halfPriceWidth)
    ).dividedBy(
      liquidity.minus(new BigNumber(2, 10).times(bestStartingQuantity))
    );
  },

  getMinMax: function (marketInfo) {
    if (marketInfo.type === "scalar") {
      return {
        minValue: new BigNumber(marketInfo.minValue, 10),
        maxValue: new BigNumber(marketInfo.maxValue, 10)
      };
    }
    return {
      minValue: new BigNumber(0),
      maxValue: new BigNumber(1, 10)
    };
  },

  calculateOrderPrices: function (liquidity, startingQuantity, bestStartingQuantity, initialFairPrices, minValue, maxValue, halfPriceWidth) {
    var priceDepth, numOutcomes, buyPrices, sellPrices, numSellOrders, numBuyOrders, shares, i, j, buyPrice, sellPrice, outcomeShares;
    priceDepth = this.calculatePriceDepth(liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue);
    if (priceDepth.lte(constants.ZERO) || priceDepth.toNumber() === Infinity) {
      return this.errors.INSUFFICIENT_LIQUIDITY;
    }
    numOutcomes = initialFairPrices.length;
    buyPrices = new Array(numOutcomes);
    sellPrices = new Array(numOutcomes);
    numSellOrders = new Array(numOutcomes);
    numBuyOrders = new Array(numOutcomes);
    shares = new BigNumber(0);
    for (i = 0; i < numOutcomes; ++i) {
      if (initialFairPrices[i].lt(minValue.plus(halfPriceWidth)) || initialFairPrices[i].gt(maxValue.minus(halfPriceWidth))) {
        if (this.options.debug.trading) {
          console.log("priceDepth:", priceDepth.toFixed());
          console.log("initialFairPrice[" + i + "]:", initialFairPrices[i].toFixed());
          console.log("minValue:", minValue.toFixed());
          console.log("maxValue:", maxValue.toFixed());
          console.log("halfPriceWidth:", halfPriceWidth.toFixed());
          console.log("minValue + halfPriceWidth:", minValue.plus(halfPriceWidth).toFixed());
          console.log("maxValue - halfPriceWidth:", maxValue.minus(halfPriceWidth).toFixed());
          console.log(initialFairPrices[i].lt(minValue.plus(halfPriceWidth)), initialFairPrices[i].gt(maxValue.minus(halfPriceWidth)));
        }
        return this.errors.INITIAL_PRICE_OUT_OF_BOUNDS;
      }
      if (initialFairPrices[i].plus(halfPriceWidth).gte(maxValue) || initialFairPrices[i].minus(halfPriceWidth).lte(minValue)) {
        return this.errors.PRICE_WIDTH_OUT_OF_BOUNDS;
      }
      buyPrice = initialFairPrices[i].minus(halfPriceWidth);
      sellPrice = initialFairPrices[i].plus(halfPriceWidth);
      numBuyOrders[i] = buyPrice.minus(minValue).dividedBy(priceDepth).floor().plus(1).toNumber();
      if (numBuyOrders[i] === 0) numBuyOrders[i] = 1;
      numSellOrders[i] = maxValue.minus(sellPrice).dividedBy(priceDepth).floor().plus(1);
      if (numSellOrders[i].eq(new BigNumber(0))) numSellOrders[i] = new BigNumber(1, 10);
      outcomeShares = bestStartingQuantity.plus(startingQuantity.times(numSellOrders[i]));
      if (outcomeShares.gt(shares)) shares = outcomeShares;
      numSellOrders[i] = numSellOrders[i].toNumber();
      buyPrices[i] = new Array(numBuyOrders[i]);
      buyPrices[i][0] = buyPrice;
      for (j = 1; j < numBuyOrders[i]; ++j) {
        buyPrices[i][j] = buyPrices[i][j - 1].minus(priceDepth);
        if (buyPrices[i][j].lte(minValue)) {
          buyPrices[i][j] = minValue.plus(priceDepth.dividedBy(new BigNumber(10, 10)));
        }
      }
      sellPrices[i] = new Array(numSellOrders[i]);
      sellPrices[i][0] = sellPrice;
      for (j = 1; j < numSellOrders[i]; ++j) {
        sellPrices[i][j] = sellPrices[i][j - 1].plus(priceDepth);
        if (sellPrices[i][j].gte(maxValue)) {
          sellPrices[i][j] = maxValue.minus(priceDepth.dividedBy(new BigNumber(10, 10)));
        }
      }
    }
    return {
      buyPrices: buyPrices,
      sellPrices: sellPrices,
      numSellOrders: numSellOrders,
      numBuyOrders: numBuyOrders,
      shares: shares
    };
  },

  calculateNumTransactions: function (numOutcomes, orders) {
    var i, numTransactions = 0;
    for (i = 0; i < numOutcomes; ++i) {
      numTransactions += orders.numBuyOrders[i] + orders.numSellOrders[i] + 3;
    }
    return numTransactions;
  },

  assignOutcomeIDs: function (numOutcomes) {
    var i, outcomes = new Array(numOutcomes);
    for (i = 0; i < numOutcomes; ++i) {
      outcomes[i] = i + 1;
    }
    return outcomes;
  },

  generateOrder: function (type, market, outcome, amount, price, scalarMinMax, callback) {
    var makeOrder, self = this;
    makeOrder = (type === "buy") ? this.buy : this.sell;
    makeOrder({
      amount: amount,
      price: price,
      market: market,
      outcome: outcome,
      scalarMinMax: scalarMinMax,
      onSent: noop,
      onSuccess: function (res) {
        callback(null, {
          id: res.callReturn,
          type: type,
          market: market,
          outcome: outcome,
          amount: amount,
          price: price,
          timestamp: res.timestamp,
          hash: res.hash,
          gasUsed: res.gasUsed
        });
      },
      onFailed: function (err) {
        if (self.options.debug.trading) {
          console.error("generateOrder", type, amount, price, outcome, "failed:", err);
        }
        callback(err);
      }
    });
  },

  generateOrdersForOutcomeOfType: function (type, market, outcome, prices, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOrder, callback) {
    var self = this;
    async.forEachOfLimit(prices, constants.PARALLEL_LIMIT, function (price, i, nextPrice) {
      var amount = (!i) ? bestStartingQuantity : startingQuantity;
      self.generateOrder(type, market, outcome, amount.toFixed(), price.toFixed(), scalarMinMax, function (err, order) {
        if (err) return nextPrice(err);
        onSetupOrder(order);
        nextPrice();
      });
    }, callback);
  },

  generateOrdersForOutcome: function (index, market, outcome, orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, callback) {
    var self = this;
    async.parallelLimit([
      function (next) {
        self.generateOrdersForOutcomeOfType("buy", market, outcome, orders.buyPrices[index], bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOrder, next);
      },
      function (next) {
        self.generateOrdersForOutcomeOfType("sell", market, outcome, orders.sellPrices[index], bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOrder, next);
      }
    ], constants.PARALLEL_LIMIT, function (err) {
      if (err && self.options.debug.trading) console.error("buy/sell:", err);
      onSetupOutcome({market: market, outcome: outcome});
      callback(err);
    });
  },

  generateOrders: function (market, outcomes, orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, onSuccess, onFailed) {
    var self = this;
    async.forEachOfLimit(outcomes, constants.PARALLEL_LIMIT, function (outcome, index, nextOutcome) {
      self.generateOrdersForOutcome(index, market, outcome, orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, nextOutcome);
    }, function (err) {
      if (err) return onFailed(err);
      self.getOrderBook(market, scalarMinMax, onSuccess);
    });
  },

  /**
   * generateOrderBook: convenience method for generating an initial order book
   * for a newly created market. generateOrderBook calculates the number of
   * orders to create, as well as the spacing between orders.
   *   - market: market ID
   *   - liquidity: initial cash to be placed on the order book
   *   - initialFairPrices: array of midpoints used for bid/offer prices when the market opens
   *   - startingQuantity: number of shares in each order
   *   - bestStartingQuantity: number of shares in best bid/offer orders (optional)
   *   - priceWidth: spread between best bid/offer
   *   - isSimulationOnly: if falsy generate order book; otherwise pass basic info to onSimulate callback
   * callbacks:
   *   onSimulate, onBuyCompleteSets, onSetupOutcome, onSetupOrder, onSuccess, onFailed
   */
  generateOrderBook: function (market, liquidity, initialFairPrices, startingQuantity, bestStartingQuantity, priceWidth, marketInfo, isSimulationOnly, onSimulate, onBuyCompleteSets, onSetupOutcome, onSetupOrder, onSuccess, onFailed) {
    var halfPriceWidth, numOutcomes, minMax, scalarMinMax, orders, self = this;
    if (market && market.constructor === Object) {
      initialFairPrices = market.initialFairPrices;
      startingQuantity = market.startingQuantity;
      bestStartingQuantity = market.bestStartingQuantity;
      priceWidth = market.priceWidth;
      marketInfo = market.marketInfo;
      isSimulationOnly = market.isSimulationOnly;
      if (liquidity && liquidity.constructor === Object) {
        onSimulate = liquidity.onSimulate;
        onBuyCompleteSets = liquidity.onBuyCompleteSets;
        onSetupOutcome = liquidity.onSetupOutcome;
        onSetupOrder = liquidity.onSetupOrder;
        onSuccess = liquidity.onSuccess;
        onFailed = liquidity.onFailed;
      } else {
        onSimulate = market.onSimulate;
        onBuyCompleteSets = market.onBuyCompleteSets;
        onSetupOutcome = market.onSetupOutcome;
        onSetupOrder = market.onSetupOrder;
        onSuccess = market.onSuccess;
        onFailed = market.onFailed;
      }
      liquidity = market.liquidity;
      market = market.market;
    }
    if (!marketInfo) return onFailed(this.errors.NO_MARKET_INFO);
    onSimulate = onSimulate || noop;
    onBuyCompleteSets = onBuyCompleteSets || noop;
    onSetupOutcome = onSetupOutcome || noop;
    onSetupOrder = onSetupOrder || noop;
    onSuccess = onSuccess || noop;
    onFailed = onFailed || noop;
    liquidity = abi.bignum(liquidity);
    initialFairPrices = abi.bignum(initialFairPrices);
    startingQuantity = abi.bignum(startingQuantity);
    bestStartingQuantity = abi.bignum(bestStartingQuantity || startingQuantity);
    halfPriceWidth = abi.bignum(priceWidth).dividedBy(2);
    numOutcomes = initialFairPrices.length;
    if (marketInfo.numOutcomes !== numOutcomes) {
      return onFailed(this.errors.WRONG_NUMBER_OF_OUTCOMES);
    }
    minMax = this.getMinMax(marketInfo);
    scalarMinMax = (marketInfo.type === "scalar") ? minMax : {};
    orders = this.calculateOrderPrices(liquidity, startingQuantity, bestStartingQuantity, initialFairPrices, minMax.minValue, minMax.maxValue, halfPriceWidth);
    if (orders.error) return onFailed(orders);
    if (isFunction(onSimulate)) {
      onSimulate({
        shares: orders.shares.toFixed(),
        numBuyOrders: orders.numBuyOrders,
        numSellOrders: orders.numSellOrders,
        buyPrices: abi.string(orders.buyPrices),
        sellPrices: abi.string(orders.sellPrices),
        numTransactions: this.calculateNumTransactions(numOutcomes, orders)
      });
      if (isSimulationOnly) return;
    }
    this.buyCompleteSets({
      market: market,
      amount: orders.shares.toFixed(),
      onSent: noop,
      onSuccess: function (res) {
        onBuyCompleteSets(res);
        self.generateOrders(market, self.assignOutcomeIDs(numOutcomes), orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, onSuccess, onFailed);
      },
      onFailed: onFailed
    });
  }
};
