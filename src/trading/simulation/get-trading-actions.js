"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var calculateTradeTotals = require("./calculate-trade-totals");
var getBidAction = require("./get-bid-action");
var getBuyAction = require("./get-buy-action");
var getAskAction = require("./get-ask-action");
var getSellAction = require("./get-sell-action");
var getShortAskAction = require("./get-short-ask-action");
var getShortSellAction = require("./get-short-sell-action");
var filterByPriceAndOutcomeAndUserSortByPrice = require("./filter-by-price-and-outcome-and-user-sort-by-price");
var calculateFxpTradingFees = require("../fees/calculate-fxp-trading-fees");
var calculateFxpMakerTakerFees = require("../fees/calculate-fxp-maker-taker-fees");
var calculateFxpAdjustedTradingFee = require("../fees/calculate-fxp-adjusted-trading-fee");
var calculateFxpTradingCost = require("../fees/calculate-fxp-trading-cost");
var shrinkScalarPrice = require("../shrink-scalar-price");
var adjustScalarSellPrice = require("../adjust-scalar-sell-price");
var isObject = require("../../utils/is-object");
var rpcInterface = require("../../rpc-interface");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

// TODO break this up
/**
 * Allows to estimate what trading methods will be called based on user's order.
 * This is useful so users know how much they pay for trading.
 *
 * @param {String} type "buy" or "sell"
 * @param {String|BigNumber} orderShares
 * @param {String|BigNumber=} orderLimitPrice null value results in market order
 * @param {String|BigNumber} takerFee Decimal string ("0.02" for 2% fee)
 * @param {String|BigNumber} makerFee Decimal string ("0.02" for 2% fee)
 * @param {String} userAddress Address of trader to exclude orders from order book
 * @param {String|BigNumber} userPositionShares
 * @param {String} outcomeID
 * @param {Object} marketOrderBook Bids and asks for market (mixed for all outcomes)
 * @param {Object} scalarMinMax {minValue, maxValue} if scalar, null otherwise
 * @return {Array}
 */
// { type, orderShares, orderLimitPrice, takerFee, makerFee, userAddress, userPositionShares, outcomeID, range, marketOrderBook, scalarMinMax }
function getTradingActions(p) {
  var remainingOrderShares, i, length, orderSharesFilled, bid, ask, bidAmount, adjustedFees, totalTakerFeeEth, adjustedLimitPrice, tradingCost, fullPrecisionPrice, matchingSortedAsks, areSuitableOrders, buyActions, etherToTrade, matchingSortedBids, areSuitableBids, userHasPosition, sellActions, etherToSell, remainingPositionShares, newBid, askShares, newTradeActions, etherToShortSell, tradingActions;
  var type = p.type;
  var takerFee = p.takerFee;
  var makerFee = p.makerFee;
  var outcomeID = p.outcomeID;
  var range = p.range;
  var marketOrderBook = p.marketOrderBook;
  var scalarMinMax = p.scalarMinMax;
  var userAddress = abi.format_address(p.userAddress);
  var orderShares = new BigNumber(p.orderShares, 10);
  var orderLimitPrice = (p.orderLimitPrice == null) ? null : new BigNumber(p.orderLimitPrice, 10);
  var bnTakerFee = new BigNumber(p.takerFee, 10);
  var bnMakerFee = new BigNumber(p.makerFee, 10);
  var bnRange = new BigNumber(p.range, 10);
  var userPositionShares = new BigNumber(p.userPositionShares, 10);
  var isMarketOrder = orderLimitPrice == null;
  var fees = calculateFxpTradingFees(bnMakerFee, bnTakerFee);
  var gasPrice = rpcInterface.getGasPrice();
  if (!isMarketOrder) {
    adjustedLimitPrice = (isObject(scalarMinMax) && scalarMinMax.minValue) ?
      new BigNumber(shrinkScalarPrice(scalarMinMax.minValue, orderLimitPrice), 10) :
      orderLimitPrice;
    adjustedFees = calculateFxpMakerTakerFees(
      calculateFxpAdjustedTradingFee(fees.tradingFee, abi.fix(adjustedLimitPrice), abi.fix(bnRange)),
      fees.makerProportionOfFee
    );
  }
  if (type === "buy") {
    matchingSortedAsks = filterByPriceAndOutcomeAndUserSortByPrice(marketOrderBook.sell, type, orderLimitPrice, outcomeID, userAddress);
    areSuitableOrders = matchingSortedAsks.length > 0;
    if (!areSuitableOrders) {
      if (isMarketOrder) {
        tradingActions = calculateTradeTotals(type, orderShares.toFixed(), orderLimitPrice && orderLimitPrice.toFixed(), []);
      } else {
        tradingActions = calculateTradeTotals(type, orderShares.toFixed(), orderLimitPrice && orderLimitPrice.toFixed(), [
          getBidAction(abi.fix(orderShares), abi.fix(adjustedLimitPrice), adjustedFees.maker, gasPrice)
        ]);
      }
    } else {
      buyActions = [];
      etherToTrade = ZERO;
      totalTakerFeeEth = ZERO;
      remainingOrderShares = orderShares;
      length = matchingSortedAsks.length;
      for (i = 0; i < length; i++) {
        ask = matchingSortedAsks[i];
        orderSharesFilled = BigNumber.min(remainingOrderShares, ask.amount);
        fullPrecisionPrice = (scalarMinMax && scalarMinMax.minValue) ?
          shrinkScalarPrice(scalarMinMax.minValue, ask.fullPrecisionPrice) :
          ask.fullPrecisionPrice;
        tradingCost = calculateFxpTradingCost(orderSharesFilled, fullPrecisionPrice, fees.tradingFee, fees.makerProportionOfFee, range);
        totalTakerFeeEth = totalTakerFeeEth.plus(tradingCost.fee);
        etherToTrade = etherToTrade.plus(tradingCost.cost);
        remainingOrderShares = remainingOrderShares.minus(orderSharesFilled);
        if (remainingOrderShares.lte(PRECISION.zero)) {
          break;
        }
      }
      buyActions.push(getBuyAction(etherToTrade, orderShares.minus(remainingOrderShares), totalTakerFeeEth, gasPrice));
      if (!remainingOrderShares.lte(PRECISION.zero) && !isMarketOrder) {
        buyActions.push(getBidAction(abi.fix(remainingOrderShares), abi.fix(orderLimitPrice), adjustedFees.maker, gasPrice));
      }
      tradingActions = calculateTradeTotals(type, orderShares.toFixed(), orderLimitPrice && orderLimitPrice.toFixed(), buyActions);
    }
  } else {
    matchingSortedBids = filterByPriceAndOutcomeAndUserSortByPrice(marketOrderBook.buy, type, orderLimitPrice, outcomeID, userAddress);
    areSuitableBids = matchingSortedBids.length > 0;
    userHasPosition = userPositionShares.gt(PRECISION.zero);
    sellActions = [];
    if (userHasPosition) {
      etherToSell = ZERO;
      remainingOrderShares = orderShares;
      remainingPositionShares = userPositionShares;
      if (areSuitableBids) {
        totalTakerFeeEth = ZERO;
        for (i = 0, length = matchingSortedBids.length; i < length; i++) {
          bid = matchingSortedBids[i];
          bidAmount = new BigNumber(bid.amount, 10);
          orderSharesFilled = BigNumber.min(bidAmount, remainingOrderShares, remainingPositionShares);
          fullPrecisionPrice = (scalarMinMax && scalarMinMax.minValue) ?
            shrinkScalarPrice(scalarMinMax.minValue, bid.fullPrecisionPrice) :
            bid.fullPrecisionPrice;
          tradingCost = calculateFxpTradingCost(orderSharesFilled, fullPrecisionPrice, fees.tradingFee, fees.makerProportionOfFee, range);
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
            newBid = clone(bid);
            newBid.amount = bidAmount.minus(orderSharesFilled).toFixed();
            matchingSortedBids[i] = newBid;
          }
          if (remainingOrderShares.lte(PRECISION.zero) || remainingPositionShares.lte(PRECISION.zero)) {
            break;
          }
        }
        sellActions.push(getSellAction(etherToSell, orderShares.minus(remainingOrderShares), totalTakerFeeEth, gasPrice));
      } else {
        if (!isMarketOrder) {
          askShares = BigNumber.min(remainingOrderShares, remainingPositionShares);
          remainingOrderShares = remainingOrderShares.minus(askShares);
          remainingPositionShares = remainingPositionShares.minus(askShares);
          sellActions.push(getAskAction(abi.fix(askShares), abi.fix(adjustedLimitPrice), adjustedFees.maker, gasPrice));
        }
      }
      if (remainingOrderShares.gt(PRECISION.zero) && !isMarketOrder) {
        // recursion
        newTradeActions = getTradingActions(type, remainingOrderShares, orderLimitPrice, takerFee, makerFee, userAddress, remainingPositionShares, outcomeID, range, { buy: matchingSortedBids }, scalarMinMax);
        if (newTradeActions.tradeActions) {
          sellActions = sellActions.concat(newTradeActions.tradeActions);
        } else {
          sellActions = sellActions.concat(newTradeActions);
        }
      }
    } else {
      if (isMarketOrder) {
        tradingActions = calculateTradeTotals(type, orderShares.toFixed(), orderLimitPrice && orderLimitPrice.toFixed(), sellActions);
      } else {
        etherToShortSell = ZERO;
        remainingOrderShares = orderShares;
        if (areSuitableBids) {
          totalTakerFeeEth = ZERO;
          for (i = 0, length = matchingSortedBids.length; i < length; i++) {
            bid = matchingSortedBids[i];
            orderSharesFilled = BigNumber.min(new BigNumber(bid.amount, 10), remainingOrderShares);
            fullPrecisionPrice = (scalarMinMax && scalarMinMax.maxValue != null) ?
              adjustScalarSellPrice(scalarMinMax.maxValue, bid.fullPrecisionPrice) :
              bid.fullPrecisionPrice;
            tradingCost = calculateFxpTradingCost(orderSharesFilled, fullPrecisionPrice, fees.tradingFee, fees.makerProportionOfFee, range);
            totalTakerFeeEth = totalTakerFeeEth.plus(tradingCost.fee);
            remainingOrderShares = remainingOrderShares.minus(orderSharesFilled);
            if (scalarMinMax && scalarMinMax.maxValue) {
              orderSharesFilled = new BigNumber(scalarMinMax.maxValue, 10).times(orderSharesFilled);
            }
            etherToShortSell = etherToShortSell.plus(orderSharesFilled.minus(tradingCost.cash));
            if (remainingOrderShares.lte(PRECISION.zero)) {
              break;
            }
          }
          sellActions.push(getShortSellAction(etherToShortSell, orderShares.minus(remainingOrderShares), totalTakerFeeEth, gasPrice));
        }
        if (remainingOrderShares.gt(PRECISION.zero)) {
          sellActions.push(getShortAskAction(abi.fix(remainingOrderShares), abi.fix(adjustedLimitPrice), adjustedFees.maker, gasPrice));
        }
      }
    }
    tradingActions = calculateTradeTotals(type, orderShares.toFixed(), orderLimitPrice && orderLimitPrice.toFixed(), sellActions);
  }
  return tradingActions;
}

module.exports = getTradingActions;
