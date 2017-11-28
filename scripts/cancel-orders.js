#!/usr/bin/env node

"use strict";

var async = require("async");
var chalk = require("chalk");
var approveAugurEternalApprovalValue = require("./approve-augur-eternal-approval-value");
var Augur = require("../src");
var noop = require("../src/utils/noop");

var augur = new Augur();

augur.rpc.setDebugOptions({ connect: true, broadcast: false, tx: false });

var ethereumNode = {
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546",
};
var augurNode = "ws://127.0.0.1:9001";

function cancelOrder(orderID, orderType, marketID, outcome, callback) {
  augur.api.CancelOrder.cancelOrder({
    tx: { gas: "0x5b8d80" },
    _orderId: orderID,
    _type: orderType === "buy" ? 0 : 1,
    _market: marketID,
    _outcome: outcome,
    onSent: noop,
    onSuccess: function (res) {
      console.log(chalk.green(marketID + " " + outcome + " " + orderType + " " + orderID));
      callback(null);
    },
    onFailed: function (err) {
      // note: continue canceling orders and just log the failure to the console...
      console.error(chalk.red(marketID + " " + outcome + " " + orderType + " " + orderID));
      callback(null);
    },
  });
}

function cancelAllOrders(creator, universe, callback) {
  console.log("Canceling orders for", creator, "in universe", universe);
  augur.trading.getOrders({ creator: creator, universe: universe }, function (err, orders) {
    if (err) return callback(err);
    async.forEachOf(orders, function (ordersInMarket, marketID, nextMarket) {
      async.forEachOf(ordersInMarket, function (ordersInOutcome, outcome, nextOutcome) {
        async.forEachOf(ordersInOutcome, function (buyOrSellOrders, orderType, nextOrderType) {
          async.each(Object.keys(buyOrSellOrders), function (orderID, nextOrder) {
            cancelOrder(orderID, orderType, marketID, outcome, nextOrder);
          }, nextOrderType);
        }, nextOutcome);
      }, nextMarket);
    }, callback);
  });
}

augur.connect({ ethereumNode: ethereumNode, augurNode: augurNode }, function (err) {
  if (err) return console.error(err);
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var creatorAddress = augur.rpc.getCoinbase();
  approveAugurEternalApprovalValue(augur, creatorAddress, function (err) {
    if (err) return console.error(err);
    cancelAllOrders(creatorAddress, universe, function (err) {
      if (err) console.error(err);
      process.exit();
    });
  });
});
