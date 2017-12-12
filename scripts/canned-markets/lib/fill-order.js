"use strict";

var async = require("async");
var chalk = require("chalk");
var getOrderToFill = require("./get-order-to-fill");
var debugOptions = require("../../debug-options");

function fillOrder(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, orderType, callback) {
  augur.markets.getMarkets({ universe: universe, sortBy: "creationBlock" }, function (err, marketIDs) {
    if (err) return callback(err);
    if (!marketIDs || !Array.isArray(marketIDs) || !marketIDs.length) return callback(marketIDs);
    augur.markets.getMarketsInfo({ marketIDs: marketIDs }, function (err, marketsInfo) {
      if (err) return callback(err);
      if (!marketsInfo || !Array.isArray(marketsInfo) || !marketsInfo.length) return callback(marketsInfo);
      async.eachSeries(marketsInfo, function (marketInfo, nextMarket) {
        getOrderToFill(augur, marketInfo.id, outcomeToTrade, orderType, fillerAddress, function (err, orderToFill) {
          if (err) return callback(err);
          if (orderToFill == null) return nextMarket();
          if (debugOptions.cannedMarkets) console.log(chalk.cyan("Filling order:"), chalk.red.bold(orderType), orderToFill);
          augur.trading.tradeUntilAmountIsZero({
            _fxpAmount: sharesToTrade,
            _price: augur.trading.normalizePrice({
              minPrice: marketInfo.minPrice,
              maxPrice: marketInfo.maxPrice,
              price: orderToFill.fullPrecisionPrice.toString(),
            }),
            numTicks: marketInfo.numTicks,
            tickSize: marketInfo.tickSize,
            _direction: orderType === "sell" ? 0 : 1,
            _market: marketInfo.id,
            _outcome: outcomeToTrade,
            _tradeGroupId: 42,
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
