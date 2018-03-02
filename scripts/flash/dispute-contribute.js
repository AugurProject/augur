#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var getPrivateKeyFromString = require("../dp/lib/get-private-key").getPrivateKeyFromString;
var repFaucet = require("../rep-faucet");
var speedomatic = require("speedomatic");
var displayTime = require("./display-time");
var setTimestamp = require("./set-timestamp");
var getPayoutNumerators = require("./get-payout-numerators");
var getBalance = require("../dp/lib/get-balances");
var doMarketContribute = require("./do-market-contribute");

var day = 108000; // day

function disputeContributeInternal(augur, marketId, outcome, amount, disputerAuth, invalid, auth, callback) {
  repFaucet(augur, disputerAuth, function (err) {
    if (err) {
      console.log(chalk.red("Error"), chalk.red(err));
      return callback(err);
    }
    if (err) return console.error(err);
    invalid = !invalid ? false : true;
    augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
      if (err) {
        console.log(chalk.red(err));
        return callback("Could not get market info");
      }
      var market = marketsInfo[0];
      var marketPayload = { tx: { to: marketId } };
      augur.api.Market.getFeeWindow(marketPayload, function (err, feeWindowId) {
        if (err) {
          console.log(chalk.red(err));
          return callback("Could not get Fee Window");
        }
        if (feeWindowId === "0x0000000000000000000000000000000000000000") {
          console.log(chalk.red("feeWindowId has not been created"));
          return callback("Market doesn't have fee window, need to report");
        }
        console.log(chalk.yellow("Market Fee Window"), chalk.yellow(feeWindowId));
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
              if (err) {
                console.log(chalk.red(err));
                return callback(err);
              }
              var payoutNumerators = getPayoutNumerators(market, outcome, invalid);
              var attoREP = speedomatic.fix(amount, "hex");
              console.log(chalk.yellow("sending amount REP"), chalk.yellow(attoREP), chalk.yellow(amount));
              augur.api.FeeWindow.isActive(feeWindowPayload, function (err, result) {
                if (err) {
                  console.log(chalk.red(err));
                  return callback(err);
                }
                console.log(chalk.green.dim("Few Window is active"), chalk.green(result));
                if (result) {
                  doMarketContribute(augur, marketId, attoREP, payoutNumerators, invalid, disputerAuth, function (err) {
                    if (err) {
                      return callback("Market contribute Failed");
                    }
                    console.log(chalk.green("Market contribute Done"));
                    callback(null);
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
  console.log(chalk.red("params syntax --> -p marketId,0,amount,<user priv key>,false"));
  console.log(chalk.red("parameter 1: marketId is needed"));
  console.log(chalk.red("parameter 2: outcome is needed"));
  console.log(chalk.red("parameter 3: user priv key is needed, env var REPORTER_PRIVATE_KEY can be used, or blank to use ETHEREUM_PRIVATE_KEY"));
  console.log(chalk.red("parameter 4: amount of REP is optional, will all of user REP"));
  console.log(chalk.red("parameter 5: invalid is optional, default is false"));
  console.log(chalk.yellow("user will be give REP if balance is 0"));
  callback(null);
}

function disputeContribute(augur, params, auth, callback) {
  if (!params || params === "help" || params.split(",").length < 2) {
    help(callback);
  } else {
    console.log(params);
    var paramArray = params.split(",");
    var marketId = paramArray[0];
    var outcomeId = paramArray[1];

    var userAuth = null;
    if (process.env.REPORTER_PRIVATE_KEY) {
      userAuth = getPrivateKeyFromString(process.env.REPORTER_PRIVATE_KEY);
    } else if (paramArray[2] !== undefined) {
      userAuth = getPrivateKeyFromString(paramArray[2]);
    }
    if (!userAuth) {
      userAuth = auth;
    }

    var amount = 0;
    if (paramArray[3] !== undefined) {
      amount = paramArray[3];
    }
    var invalid = paramArray.length === 5 ? paramArray[4] : false;
    if (!userAuth) userAuth = auth;
    console.log(chalk.yellow.dim("marketId"), marketId);
    console.log(chalk.yellow.dim("outcome"), outcomeId);
    console.log(chalk.yellow.dim("owner"), auth.address);
    console.log(chalk.yellow.dim("invalid"), invalid);
    if (amount === 0) {
      var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
      getBalance(augur, universe, userAuth.address, function (err, balances) {
        if (err) {
          console.log(chalk.red(err));
          return callback(JSON.stringify(err));
        }
        amount = balances.reputation;
        console.log(chalk.yellow.dim("amount"), amount);
        disputeContributeInternal(augur, marketId, outcomeId, amount, userAuth, invalid, auth, callback);
      });
    } else {
      console.log(chalk.yellow.dim("amount"), amount);
      disputeContributeInternal(augur, marketId, outcomeId, amount, userAuth, invalid, auth, callback);
    }
  }
}

module.exports = disputeContribute;
