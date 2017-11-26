#!/usr/bin/env node

"use strict";

var BigNumber = require("bignumber.js");
var approveAugurEternalApprovalValue = require("./approve-augur-eternal-approval-value");
var Augur = require("../src");
var constants = require("../src/constants");

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
  augur.markets.getMarkets({ universe: universe, limit: 10 }, function (err, marketIDs) {
    if (err) return callback(err);
    if (!marketIDs || !Array.isArray(marketIDs) || !marketIDs.length) return callback(marketIDs);
    var marketID = marketIDs[8];
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
        var tradePayload = {
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
        };
        // TODO remove shareToken approvals after contracts upgraded
        augur.api.Market.getShareToken({ tx: { to: marketID }, _outcome: outcomeToTrade }, function (err, shareToken) {
          if (err) return callback(err);
          augur.api.ShareToken.allowance({
            tx: { to: shareToken },
            _owner: fillerAddress,
            _spender: augur.contracts.addresses[augur.rpc.getNetworkID()].Order,
          }, function (err, allowance) {
            if (err) return callback(err);
            if (new BigNumber(allowance, 10).eq(new BigNumber(constants.ETERNAL_APPROVAL_VALUE, 16))) {
              augur.trading.tradeUntilAmountIsZero(tradePayload);
            } else {
              augur.api.ShareToken.approve({
                tx: { to: shareToken },
                _spender: augur.contracts.addresses[augur.rpc.getNetworkID()].Order,
                _value: constants.ETERNAL_APPROVAL_VALUE,
                onSent: function (res) {
                  console.log("ShareToken.approve sent:", res.hash);
                },
                onSuccess: function (res) {
                  console.log("ShareToken.approve success:", res.callReturn);
                  augur.trading.tradeUntilAmountIsZero(tradePayload);
                },
                onFailed: function (err) {
                  console.error("ShareToken.approve failed:", err);
                  callback(err);
                },
              });
            }
          });
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
