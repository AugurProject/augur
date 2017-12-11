#!/usr/bin/env node

"use strict";

var async = require("async");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./approve-augur-eternal-approval-value");
var connectionEndpoints = require("./connection-endpoints");
var debugOptions = require("./debug-options");
var DEBUG = debugOptions.cannedMarkets;

var outcomeToTrade = 0;
var sharesToTrade = "1";

function getOrderToFill(augur, marketID, outcomeToTrade, orderType, fillerAddress, callback) {
  augur.trading.getOrders({ marketID: marketID, outcome: outcomeToTrade, orderType: orderType }, function (err, orderBook) {
    if (err) return callback(err);
    if (!orderBook[marketID] || !orderBook[marketID][outcomeToTrade] || !orderBook[marketID][outcomeToTrade][orderType]) {
      return callback(null);
    }
    var orders = orderBook[marketID][outcomeToTrade][orderType];
    var orderIDToFill = Object.keys(orders).find(function (orderID) {
      return orders[orderID].orderState !== "CANCELED" && orders[orderID].creator !== fillerAddress;
    });
    if (DEBUG) console.log("orderToFill:", orderType, orderIDToFill, orders[orderIDToFill]);
    callback(null, orders[orderIDToFill]);
  });
}

function fillOrder(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, orderType, callback) {
  augur.markets.getMarkets({ universe: universe, sortBy: "creationBlockNumber" }, function (err, marketIDs) {
    if (err) return callback(err);
    if (!marketIDs || !Array.isArray(marketIDs) || !marketIDs.length) return callback(marketIDs);
    augur.markets.getMarketsInfo({ marketIDs: marketIDs }, function (err, marketsInfo) {
      if (err) return callback(err);
      if (!marketsInfo || !Array.isArray(marketsInfo) || !marketsInfo.length) return callback(marketsInfo);
      async.eachSeries(marketsInfo, function (marketInfo, nextMarket) {
        if (DEBUG) console.log("marketInfo:", marketInfo);
        getOrderToFill(augur, marketInfo.id, outcomeToTrade, orderType, fillerAddress, function (err, orderToFill) {
          if (err) return callback(err);
          if (orderToFill === null) return nextMarket();
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
              console.log("Trade completed,", tradeAmountRemaining, "shares remaining");
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

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var fillerAddress = augur.rpc.getCoinbase();
  approveAugurEternalApprovalValue(augur, fillerAddress, function (err) {
    if (err) return console.error(err);
    async.parallel([
      function (next) {
        fillOrder(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, "sell", function (err) {
          if (err) console.error("fill ask order failed:", err);
          next();
        });
      },
      function (next) {
        fillOrder(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, "buy", function (err) {
          if (err) console.error("fill bid order failed:", err);
          next();
        });
      },
    ], process.exit);
  });
});
