#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var getPrivateKeyFromString = require("../dp/lib/get-private-key").getPrivateKeyFromString;
var repFaucet = require("../rep-faucet");
var BigNumber = require("bignumber.js");
var displayTime = require("./display-time");
var setTimestamp = require("./set-timestamp");

var day = 108000; // day

function disputeContributeInternal(augur, marketID, outcome, amount, disputerAuth, invalid, auth, callback) {
  repFaucet(augur, disputerAuth, function (err) {
    if (err) {
      console.log(chalk.red("Error"), chalk.red(err));
      return callback(err);
    }
    if (err) return console.error(err);
    invalid = !invalid ? false : true;
    augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
      if (err) {
        console.log(chalk.red(err));
        return callback("Could not get market info");
      }
      var market = marketsInfo[0];
      var marketPayload = { tx: { to: marketID } };
      augur.api.Market.getFeeWindow(marketPayload, function (err, feeWindowId) {
        if (err) {
          console.log(chalk.red(err));
          return callback("Could not get Fee Window");
        }
        if (feeWindowId === "0x0000000000000000000000000000000000000000") {
          console.log(chalk.red("feeWindowId has not been created"));
          return callback("Market doesn't have fee window, need to report");
        }
        var feeWindowPayload = { tx: { to: feeWindowId } };
        augur.api.FeeWindow.getStartTime(feeWindowPayload, function (err, feeWindowStartTime) {
          if (err) {
            console.log(chalk.red(err));
            callback("Could not get Fee Window");
          }
          getTime(augur, auth, function (err, timeResult) {
            if (err) {
              console.log(chalk.red(err));
              return callback(err);
            }

            var setTime = parseInt(feeWindowStartTime, 10) + day;
            displayTime("Current timestamp", timeResult.timestamp);
            displayTime("Fee Window end time", feeWindowStartTime);
            displayTime("Set Time to", setTime);
            setTimestamp(augur, setTime, timeResult.timeAddress, auth, function (err) {
              console.log("set time err", err);
              if (err) {
                console.log(chalk.red(err));
                return callback(err);
              }
              var numTicks = market.numTicks;
              var payoutNumerators = Array(market.numOutcomes).fill(0);
              payoutNumerators[outcome] = numTicks;
              var stringAmount = "0x" + new BigNumber(amount, 10).toString(16);
              console.log(chalk.yellow("sending amount REP"), chalk.yellow(stringAmount));
              augur.api.FeeWindow.isActive(feeWindowPayload, function (err, result) {
                console.log("err", err, "value", result);
                if (err) {
                  console.log(chalk.red(err));
                  return callback(err);
                }
                console.log(chalk.green.dim("Few Window is active"), chalk.green(result));
                if (result) {
                  augur.api.Market.contribute({
                    meta: disputerAuth,
                    tx: { to: marketID  },
                    _payoutNumerators: payoutNumerators,
                    _invalid: invalid,
                    _amount: stringAmount,
                    onSent: function (result) {
                      console.log(chalk.yellow.dim("Sent Dispute:"), chalk.yellow(JSON.stringify(result)));
                      console.log(chalk.yellow.dim("Waiting for reply ...."));
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
                } else {
                  console.log(chalk.red("Fee Window isn't active"));
                  callback("Fee Window isn't active");
                }
              });
            });
          });
        });
      });
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> -p marketID,0,amount,<user priv key>,false"));
  console.log(chalk.red("parameter 1: marketID is needed"));
  console.log(chalk.red("parameter 2: outcome is needed"));
  console.log(chalk.red("parameter 3: amount of REP is needed"));
  console.log(chalk.red("parameter 4: user priv key is needed"));
  console.log(chalk.red("parameter 5: invalid is optional, default is false"));
  console.log(chalk.yellow("user will be give REP if balance is 0"));
  callback(null);
}

function disputeContribute(augur, params, auth, callback) {
  if (!params || params === "help" || params.split(",").length < 3) {
    help(callback);
  } else {
    console.log(params);
    var paramArray = params.split(",");
    var marketID = paramArray[0];
    var outcomeId = paramArray[1];
    var amount = paramArray[2];
    var userAuth = getPrivateKeyFromString(paramArray[3]);
    var invalid = paramArray.length === 5 ? paramArray[4] : false;
    console.log(chalk.yellow.dim("marketID"), marketID);
    console.log(chalk.yellow.dim("outcomeId"), outcomeId);
    console.log(chalk.yellow.dim("amount"), amount);
    console.log(chalk.yellow.dim("reporter"), userAuth.address);
    console.log(chalk.yellow.dim("owner"), auth.address);
    console.log(chalk.yellow.dim("invalid"), invalid);
    disputeContributeInternal(augur, marketID, outcomeId, amount, userAuth, invalid, auth, callback);
  }
}

module.exports = disputeContribute;
