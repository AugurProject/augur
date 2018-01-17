#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var approveAugurEternalApprovalValue = require("../canned-markets/lib/approve-augur-eternal-approval-value");
var getPrivateKey = require("../canned-markets/lib/get-private-key");
var getOrderToFill = require("../canned-markets/lib/get-order-to-fill");
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var keystoreFilePath = process.argv[2];
var marketID = process.argv[3];
var orderType = process.argv[4];
var outcomeToFill = process.argv[5];
var sharesToFill = process.argv[6];
var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

getPrivateKey(keystoreFilePath, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error(err);
    var fillerAddress = auth.address;
    approveAugurEternalApprovalValue(augur, fillerAddress, auth, function (err) {
      if (err) return console.error(err);
      if (!outcomeToFill) console.log(chalk.red("outcome is needed"));
      if (!sharesToFill) console.log(chalk.red("shares to fill is needed"));
      if (!outcomeToFill || !sharesToFill) return;
      augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
        if (err) { console.log(chalk.red(err)); return; }
        if (!marketsInfo || !Array.isArray(marketsInfo) || !marketsInfo.length) { console.log(chalk.red("no markets found")); return; }
        var marketInfo = marketsInfo[0];
        console.log(chalk.yellow.dim("marketID"), chalk.yellow(marketID));
        console.log(chalk.yellow.dim("orderType"), chalk.yellow(orderType));
        console.log(chalk.yellow.dim("outcomeToFill"), chalk.yellow(outcomeToFill));
        console.log(chalk.yellow.dim("filler address"), chalk.yellow(fillerAddress));
        getOrderToFill(augur, marketID, outcomeToFill, orderType, fillerAddress, function (err, orderToFill) {
          if (err) { console.log(chalk.red(err)); return; }
          if (orderToFill == null)  { console.log(chalk.red("No order found")); return; }
          if (debugOptions.cannedMarkets) console.log(chalk.cyan("Filling order:"), chalk.red.bold(orderType), orderToFill);
          augur.trading.tradeUntilAmountIsZero({
            meta: auth,
            _fxpAmount: sharesToFill,
            _price: augur.trading.normalizePrice({
              minPrice: marketInfo.minPrice,
              maxPrice: marketInfo.maxPrice,
              price: orderToFill.fullPrecisionPrice.toString(),
            }),
            numTicks: marketInfo.numTicks,
            tickSize: marketInfo.tickSize,
            _direction: orderType === "sell" ? 0 : 1,
            _market: marketInfo.id,
            _outcome: outcomeToFill,
            _tradeGroupId: 42,
            doNotCreateOrders: true,
            onSent: function () {},
            onSuccess: function (tradeAmountRemaining) {
              if (debugOptions.cannedMarkets) {
                console.log(chalk.cyan("Trade completed,"), chalk.red.bold(orderType), chalk.green(tradeAmountRemaining), chalk.cyan.dim("shares remaining"));
              }
            },
            onFailed: function (err) {
              console.log(chalk.red("err"), chalk.red(err));
              return;
            },
          });
        });
      });
    });
  });
});
