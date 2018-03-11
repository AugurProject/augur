"use strict";

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
        if (debugOptions.cannedMarkets) console.log(chalk.white.dim(new Date().toString()), chalk.green(marketId + " " + outcome + " ") + chalk.red.bold(orderType) + chalk.green(" " + orderId));
        callback(null);
      },
      onFailed: function (err) {
        // log the failure to the console and continue canceling orders
        console.error(chalk.white.dim(new Date().toString()), chalk.red(marketId + " " + outcome + " ") + chalk.red.bold(orderType) + chalk.green(" " + orderId), err);
        callback(null);
      },
    });
  });
}

module.exports = cancelOrder;
