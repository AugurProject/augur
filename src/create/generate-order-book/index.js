"use strict";

var abi = require("augur-abi");
var assignOutcomeIDs = require("./assign-outcome-ids");
var calculateOrderPrices = require("./calculate-order-prices");
var calculateNumTransactions = require("./calculate-num-transactions");
var generateOrders = require("./generate-orders");
var getMinMax = require("./get-min-max");
var api = require("../../api");
var noop = require("../../utils/noop");
var isFunction = require("../../utils/is-function");
var isObject = require("../../utils/is-object");
var errors = reqiure("../../rpc-interface").errors;

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
function generateOrderBook(market, liquidity, initialFairPrices, startingQuantity, bestStartingQuantity, priceWidth, marketInfo, isSimulationOnly, onSimulate, onBuyCompleteSets, onSetupOutcome, onSetupOrder, onSuccess, onFailed) {
  var halfPriceWidth, numOutcomes, minMax, scalarMinMax, orders;
  if (isObject(market)) {
    initialFairPrices = market.initialFairPrices;
    startingQuantity = market.startingQuantity;
    bestStartingQuantity = market.bestStartingQuantity;
    priceWidth = market.priceWidth;
    marketInfo = market.marketInfo;
    isSimulationOnly = market.isSimulationOnly;
    if (isObject(liquidity)) {
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
  if (!marketInfo) return onFailed(errors.NO_MARKET_INFO);
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
    return onFailed(errors.WRONG_NUMBER_OF_OUTCOMES);
  }
  minMax = getMinMax(marketInfo);
  scalarMinMax = (marketInfo.type === "scalar") ? minMax : {};
  orders = calculateOrderPrices(liquidity, startingQuantity, bestStartingQuantity, initialFairPrices, minMax.minValue, minMax.maxValue, halfPriceWidth);
  if (orders.error) return onFailed(orders);
  if (isFunction(onSimulate)) {
    onSimulate({
      shares: orders.shares.toFixed(),
      numBuyOrders: orders.numBuyOrders,
      numSellOrders: orders.numSellOrders,
      buyPrices: abi.string(orders.buyPrices),
      sellPrices: abi.string(orders.sellPrices),
      numTransactions: calculateNumTransactions(numOutcomes, orders)
    });
    if (isSimulationOnly) return;
  }
  api.CompleteSets.buyCompleteSets({
    market: market,
    amount: orders.shares.toFixed(),
    onSent: noop,
    onSuccess: function (res) {
      onBuyCompleteSets(res);
      generateOrders(market, assignOutcomeIDs(numOutcomes), orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, onSuccess, onFailed);
    },
    onFailed: onFailed
  });
}

module.exports = generateOrderBook;
