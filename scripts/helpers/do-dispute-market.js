#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");
var { getPrivateKey, getPrivateKeyFromString } = require("../augur-tool/lib/get-private-key");
var getTime = require("./get-timestamp");
var BigNumber = require("bignumber.js");

var marketID = process.argv[2];
var outcome = process.argv[3];
var disputer = process.argv[4];
var amount = process.argv[5];
var invalid = process.argv[6];

var augur = new Augur();


/**
 * Move time to Market end time and do initial report
 */
getPrivateKey(null, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  if (!disputer) { console.error(chalk.red("Need disputers private key")); process.exit(1); }
  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error(err);
    if (!invalid) { invalid = false; } else { invalid = true; }
    var timestamp = augur.api.Controller.getTimestamp();
    console.log(chalk.yellow.dim("Current Timestamp"), chalk.yellow(timestamp));
    augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
      var market = marketsInfo[0];
      var marketPayload = { tx: { to: marketID } };
      augur.api.Market.getFeeWindow(marketPayload, function (err, feeWindowId) {
        var feeWindowPayload = { tx: { to: feeWindowId } };
        augur.api.FeeWindow.isActive(feeWindowPayload, function (err, result) {
          console.log(chalk.green.dim("Few Window is active"), chalk.green(result));
          augur.api.FeeWindow.getEndTime(feeWindowPayload, function (err, endTime) {
            console.log(chalk.yellow.dim("Few Window End Time"), chalk.yellow(endTime));
            getTime(auth, function (timeResult) {
              endTime = parseInt(endTime, 10) - 10000;
              var timeToSet = parseInt(endTime, 10);
              console.log(chalk.yellow.dim("Current timestamp"), chalk.yellow(timeResult.timestamp), chalk.yellow.dim("set time"), chalk.yellow(timeToSet));
              var disputerAuth = getPrivateKeyFromString(disputer);
              var timePayload = {
                meta: auth,
                tx: { to: timeResult.timeAddress  },
                _timestamp: timeToSet,
                onSent: function () {
                },
                onSuccess: function () {
                  console.log(chalk.green.dim("Current time"), chalk.green(endTime));
                  var numTicks = market.numTicks;
                  var payoutNumerators = Array(market.numOutcomes).fill(0);
                  payoutNumerators[outcome] = numTicks;
                  var bnAmount = new BigNumber(amount, 10).toFixed();

                  var disputePayload = {
                    meta: disputerAuth,
                    tx: { to: marketID  },
                    _payoutNumerators: payoutNumerators,
                    _invalid: invalid,
                    _amount: bnAmount,
                    onSent: function (result) {
                      console.log(chalk.yellow.dim("Sent Dispute:"), chalk.yellow(JSON.stringify(result)));
                    },
                    onSuccess: function (result) {
                      console.log(chalk.green.dim("Success Dispute:"), chalk.green(JSON.stringify(result)));
                      process.exit(0);
                    },
                    onFailed: function (result) {
                      console.log(chalk.red.dim("Failed Dispute:"), chalk.red(JSON.stringify(result)));
                      process.exit(1);
                    },
                  };

                  console.log(chalk.green.dim("disputePayload:"), chalk.green(JSON.stringify(disputePayload)));
                  augur.api.Market.contribute(disputePayload);
                },
                onFailed: function (result) {
                  console.log(chalk.red.dim("Failed Setting Time:"), chalk.red(JSON.stringify(result)));
                  process.exit(1);
                },
              };
              augur.api.TimeControlled.setTimestamp(timePayload);
            });
          });
        });
      });
    });
  });
});


