#!/usr/bin/env node

"use strict";

var async = require("async");
var chalk = require("chalk");
var approveAugurEternalApprovalValue = require("./approve-augur-eternal-approval-value");
var Augur = require("../../src");
var noop = require("../../src/utils/noop");
var constants = require("../../src/constants");
var connectionEndpoints = require("./connection-endpoints");
var debugOptions = require("./debug-options");

function cancelOrder(augur, orderID, orderType, marketID, outcome, callback) {
  augur.api.CancelOrder.cancelOrder({
    tx: { gas: constants.CANCEL_ORDER_GAS },
    _orderId: orderID,
    _type: orderType === "buy" ? 0 : 1,
    _market: marketID,
    _outcome: outcome,
    onSent: noop,
    onSuccess: function () {
      console.log(chalk.green(marketID + " " + outcome + " " + orderType + " " + orderID));
      callback(null);
    },
    onFailed: function () {
      // note: continue canceling orders and just log the failure to the console...
      console.error(chalk.red(marketID + " " + outcome + " " + orderType + " " + orderID));
      callback(null);
    },
  });
}

function cancelAllOrders(augur, creator, universe, callback) {
  console.log("Canceling orders for", creator, "in universe", universe);
  augur.trading.getOrders({ creator: creator, universe: universe }, function (err, orders) {
    if (err) return callback(err);
    async.forEachOf(orders, function (ordersInMarket, marketID, nextMarket) {
      async.forEachOf(ordersInMarket, function (ordersInOutcome, outcome, nextOutcome) {
        async.forEachOf(ordersInOutcome, function (buyOrSellOrders, orderType, nextOrderType) {
          async.each(Object.keys(buyOrSellOrders), function (orderID, nextOrder) {
            cancelOrder(augur, orderID, orderType, marketID, outcome, nextOrder);
          }, nextOrderType);
        }, nextOutcome);
      }, nextMarket);
    }, callback);
  });
}

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var creatorAddress = augur.rpc.getCoinbase();
  approveAugurEternalApprovalValue(augur, creatorAddress, function (err) {
    if (err) return console.error(err);
    cancelAllOrders(augur, creatorAddress, universe, function (err) {
      if (err) console.error(err);
      process.exit();
    });
  });
});
