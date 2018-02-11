#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
const { getPrivateKeyFromString } = require("../dp/lib/get-private-key");
const repFaucet = require("../rep-faucet");
var BigNumber = require("bignumber.js");

function disputeContributeInternal(augur, marketId, outcome, amount, disputerAuth, invalid, auth, callback) {
  repFaucet(augur, disputerAuth, function (err) {
    if (err) { console.log(chalk.red("Error"), chalk.red(err)); callback(err); }
    if (err) return console.error(err);
    if (!invalid) { invalid = false; } else { invalid = true; }
    var timestamp = augur.api.Controller.getTimestamp();
    console.log(chalk.yellow.dim("Current Timestamp"), chalk.yellow(timestamp));
    augur.markets.getMarketsInfo({ marketIDs: [marketId] }, function (err, marketsInfo) {
      var market = marketsInfo[0];
      var marketPayload = { tx: { to: marketId } };
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

              augur.api.TimeControlled.setTimestamp({
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

                  augur.api.Market.contribute({
                    meta: disputerAuth,
                    tx: { to: marketId  },
                    _payoutNumerators: payoutNumerators,
                    _invalid: invalid,
                    _amount: bnAmount,
                    onSent: function (result) {
                      console.log(chalk.yellow.dim("Sent Dispute:"), chalk.yellow(JSON.stringify(result)));
                    },
                    onSuccess: function (result) {
                      console.log(chalk.green.dim("Success Dispute:"), chalk.green(JSON.stringify(result)));
                      callback(null);
                    },
                    onFailed: function (result) {
                      console.log(chalk.red.dim("Failed Dispute:"), chalk.red(JSON.stringify(result)));
                      callback(result);
                    },
                  });
                },
                onFailed: function (result) {
                  console.log(chalk.red.dim("Failed Setting Time:"), chalk.red(JSON.stringify(result)));
                  callback(result);
                },
              });
            });
          });
        });
      });
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax -->  params=marketId,0,amount,<user priv key>,false"));
  console.log(chalk.red("parameter 1: marketId is needed"));
  console.log(chalk.red("parameter 2: outcome is needed"));
  console.log(chalk.red("parameter 3: amount of REP is needed"));
  console.log(chalk.red("parameter 4: user priv key is needed"));
  console.log(chalk.red("parameter 5: invalid is optional, default is false"));
  callback(null);
}

function disputeContribute(augur, params, auth, callback) {
  if (!params || params === "help" || params.split(",").length < 3) {
    help(callback);
  } else {
    var paramArray = params.split(",");
    var marketId = paramArray[0];
    var outcomeId = paramArray[1];
    var amount = paramArray[2];
    var userAuth = getPrivateKeyFromString(paramArray[3]);
    var invalid = paramArray.length === 5 ? paramArray[4] : false;
    console.log(chalk.yellow.dim("marketId"), marketId);
    console.log(chalk.yellow.dim("outcomeId"), outcomeId);
    console.log(chalk.yellow.dim("amount"), amount);
    console.log(chalk.yellow.dim("reporter"), userAuth.address);
    console.log(chalk.yellow.dim("owner"), auth.address);
    console.log(chalk.yellow.dim("invalid"), invalid);
    disputeContributeInternal(augur, marketId, outcomeId, amount, userAuth, invalid, auth, callback);
  }
}

module.exports = disputeContribute;
