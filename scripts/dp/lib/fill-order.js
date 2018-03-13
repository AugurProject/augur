"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var chalk = require("chalk");
var getOrderToFill = require("./get-order-to-fill");
var debugOptions = require("../../debug-options");

function fillOrder(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, orderType, auth, callback) {
  augur.markets.getMarkets({ universe: universe, sortBy: "creationBlock" }, function (err, marketIds) {
    if (err) return callback(err);
    if (!marketIds || !Array.isArray(marketIds) || !marketIds.length) return callback(marketIds);
    augur.markets.getMarketsInfo({ marketIds: marketIds }, function (err, marketsInfo) {
      if (err) return callback(err);
      if (!marketsInfo || !Array.isArray(marketsInfo) || !marketsInfo.length) return callback(marketsInfo);
      async.eachSeries(marketsInfo, function (marketInfo, nextMarket) {
        getOrderToFill(augur, marketInfo.id, outcomeToTrade, orderType, fillerAddress, function (err, orderToFill) {
          if (err) return callback(err);
          if (orderToFill == null || new BigNumber(orderToFill.amount).eq(new BigNumber(0))) return nextMarket();
          if (debugOptions.cannedMarkets) console.log(chalk.cyan("Filling order:"), chalk.red.bold(orderType), orderToFill);
          var displayPrice = orderToFill.fullPrecisionPrice.toString();
          var displayAmount = sharesToTrade;
          var direction = orderType === "sell" ? 0 : 1;
          var tradeCost = augur.trading.calculateTradeCost({
            displayPrice: displayPrice,
            displayAmount: displayAmount,
            numTicks: marketInfo.numTicks,
            orderType: direction,
            minDisplayPrice: marketInfo.minPrice,
            maxDisplayPrice: marketInfo.maxPrice,
          });
          if (new BigNumber(tradeCost.cost, 16).gt(1)) {
            sharesToTrade = new BigNumber(sharesToTrade, 10).dividedBy(new BigNumber(tradeCost.cost, 16)).toFixed();
          }
          augur.trading.tradeUntilAmountIsZero({
            meta: auth,
            _fxpAmount: displayAmount,
            _price: displayPrice,
            numTicks: marketInfo.numTicks,
            minPrice: marketInfo.minPrice,
            maxPrice: marketInfo.maxPrice,
            _direction: direction,
            _market: marketInfo.id,
            _outcome: outcomeToTrade,
            _tradeGroupId: augur.trading.generateTradeGroupId(),
            doNotCreateOrders: true,
            onSent: function () {},
            onSuccess: function (tradeAmountRemaining) {
              if (debugOptions.cannedMarkets) {
                console.log(chalk.cyan("Trade completed,"), chalk.red.bold(orderType), chalk.green(tradeAmountRemaining), chalk.cyan.dim("shares remaining"));
              }
              nextMarket(true);
            },
            onFailed: nextMarket,
          });
        });
      }, function (errorOrTrue) {
        if (errorOrTrue !== true) return callback(errorOrTrue);
        callback(null);
      });
    });
  });
}

module.exports = fillOrder;
