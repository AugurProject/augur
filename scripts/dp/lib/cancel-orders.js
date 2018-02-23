"use strict";

var async = require("async");
var chalk = require("chalk");
var debugOptions = require("../../debug-options");

function cancelOrder(augur, orderId, orderType, marketId, outcome, auth, callback) {
  augur.api.Orders.getAmount({ _orderId: orderId }, function (err, amount) {
    if (err) return callback(err);
    if (amount === "0") return callback(null);
    augur.api.CancelOrder.cancelOrder({
      meta: auth,
      tx: { gas: augur.constants.CANCEL_ORDER_GAS },
      _orderId: orderId,
      onSent: function () {},
      onSuccess: function () {
        if (debugOptions.cannedMarkets) console.log(chalk.green(marketId + " " + outcome + " ") + chalk.red.bold(orderType) + chalk.green(" " + orderId));
        callback(null);
      },
      onFailed: function (err) {
        // log the failure to the console and continue canceling orders
        console.error(chalk.red(marketId + " " + outcome + " ") + chalk.red.bold(orderType) + chalk.green(" " + orderId), err);
        callback(null);
      },
    });
  });
}

function cancelOrders(augur, creator, universe, auth, callback) {
  console.log(chalk.cyan("Canceling orders for"), chalk.green(creator), chalk.cyan("in universe"), chalk.green(universe));
  augur.trading.getOrders({ creator: creator, universe: universe, orderState: augur.constants.ORDER_STATE.OPEN }, function (err, orders) {
    if (err) return callback(err);
    async.forEachOf(orders, function (ordersInMarket, marketId, nextMarket) {
      async.forEachOf(ordersInMarket, function (ordersInOutcome, outcome, nextOutcome) {
        async.forEachOf(ordersInOutcome, function (buyOrSellOrders, orderType, nextOrderType) {
          async.each(Object.keys(buyOrSellOrders), function (orderId, nextOrder) {
            if (debugOptions.cannedMarkets) console.log(chalk.green(orderId), chalk.red.bold(orderType), JSON.stringify(buyOrSellOrders[orderId], null, 2));
            cancelOrder(augur, orderId, orderType, marketId, parseInt(outcome, 10), auth, nextOrder);
          }, nextOrderType);
        }, nextOutcome);
      }, nextMarket);
    }, callback);
  });
}

module.exports = cancelOrders;
