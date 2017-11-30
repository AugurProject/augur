#!/usr/bin/env node

"use strict";

var approveAugurEternalApprovalValue = require("./approve-augur-eternal-approval-value");
var Augur = require("../src");

var augur = new Augur();

augur.rpc.setDebugOptions({ connect: true, broadcast: false, tx: false });

var ethereumNode = {
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546",
};
var augurNode = "ws://127.0.0.1:9001";

var outcomeToTrade = 0;
var sharesToTrade = "0.000012";

function fillAskOrder(universe, fillerAddress, outcomeToTrade, sharesToTrade, callback) {
  augur.markets.getMarkets({ universe: universe, limit: 1 }, function (err, marketIDs) {
    if (err) return callback(err);
    if (!marketIDs || !Array.isArray(marketIDs) || !marketIDs.length) return callback(marketIDs);
    var marketID = marketIDs[0];
    augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
      if (err) return callback(err);
      if (!marketsInfo || !Array.isArray(marketsInfo) || !marketsInfo.length) return callback(marketsInfo);
      var marketInfo = marketsInfo[0];
      console.log("market info:", marketInfo);
      augur.trading.getOrders({ marketID: marketID }, function (err, orders) {
        if (err) return callback(err);
        if (!orders[marketID] || !orders[marketID][outcomeToTrade] || !orders[marketID][outcomeToTrade].sell) return callback(orders);
        var orderIDToFill = Object.keys(orders[marketID][outcomeToTrade].sell)[0];
        var orderToFill = orders[marketID][outcomeToTrade].sell[orderIDToFill];
        console.log("filling order:", orderIDToFill, orderToFill);
        augur.trading.tradeUntilAmountIsZero({
          _fxpAmount: sharesToTrade,
          _price: augur.trading.normalizePrice({ minPrice: marketInfo.minPrice, maxPrice: marketInfo.maxPrice, price: orderToFill.fullPrecisionPrice.toString() }),
          numTicks: marketInfo.numTicks,
          _direction: 0,
          _market: marketID,
          _outcome: outcomeToTrade,
          _tradeGroupId: 42,
          doNotCreateOrders: true,
          onSent: function () {},
          onSuccess: function (tradeAmountRemaining) { callback(null, tradeAmountRemaining); },
          onFailed: callback,
        });
      });
    });
  });
}

augur.connect({ ethereumNode: ethereumNode, augurNode: augurNode }, function (err) {
  if (err) return console.error(err);
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var fillerAddress = augur.rpc.getCoinbase();
  approveAugurEternalApprovalValue(augur, fillerAddress, function (err) {
    if (err) return console.error(err);
    fillAskOrder(universe, fillerAddress, outcomeToTrade, sharesToTrade, function (err, tradeAmountRemaining) {
      if (err) console.error(err);
      console.log("Trade completed,", tradeAmountRemaining, "shares remaining");
      process.exit();
    });
  });
});
