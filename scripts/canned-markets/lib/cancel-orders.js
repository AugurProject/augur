"use strict";

var async = require("async");
var chalk = require("chalk");
var debugOptions = require("../../debug-options");

function cancelOrder(augur, orderID, orderType, marketID, outcome, auth, callback) {
  augur.api.Orders.getAmount({ _orderId: orderID }, function (err, amount) {
    if (err) return callback(err);
    if (amount === "0") return callback(null);
    augur.api.CancelOrder.cancelOrder({
      meta: auth,
      tx: { gas: augur.constants.CANCEL_ORDER_GAS },
      _orderId: orderID,
      _type: orderType === "buy" ? 0 : 1,
      _market: marketID,
      _outcome: outcome,
      onSent: function () {},
      onSuccess: function () {
        if (debugOptions.cannedMarkets) console.log(chalk.green(marketID + " " + outcome + " ") + chalk.red.bold(orderType) + chalk.green(" " + orderID));
        callback(null);
      },
      onFailed: function (err) {
        // log the failure to the console and continue canceling orders
        console.error(chalk.red(marketID + " " + outcome + " ") + chalk.red.bold(orderType) + chalk.green(" " + orderID), err);
        callback(null);
      },
    });
  });
}

function cancelOrders(augur, creator, universe, auth, callback) {
  console.log(chalk.cyan("Canceling orders for"), chalk.green(creator), chalk.cyan("in universe"), chalk.green(universe));
  augur.trading.getOrders({ creator: creator, universe: universe }, function (err, orders) {
    if (err) return callback(err);
    async.forEachOf(orders, function (ordersInMarket, marketID, nextMarket) {
      async.forEachOf(ordersInMarket, function (ordersInOutcome, outcome, nextOutcome) {
        async.forEachOf(ordersInOutcome, function (buyOrSellOrders, orderType, nextOrderType) {
          async.each(Object.keys(buyOrSellOrders), function (orderID, nextOrder) {
            if (debugOptions.cannedMarkets) console.log(chalk.green(orderID), chalk.red.bold(orderType), JSON.stringify(buyOrSellOrders[orderID], null, 2));
            cancelOrder(augur, orderID, orderType, marketID, parseInt(outcome, 10), auth, nextOrder);
          }, nextOrderType);
        }, nextOutcome);
      }, nextMarket);
    }, callback);
  });
}

module.exports = cancelOrders;
