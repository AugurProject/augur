#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");
var displayTime = require("./display-time");
var goToFork = require("./go-to-fork");
var getPrivateKeyFromString = require("../dp/lib/get-private-key").getPrivateKeyFromString;
var getPayoutNumerators = require("./get-payout-numerators");
var repFaucet = require("../rep-faucet");

/**
 * Move time to Market end time and do go to a fork
 */
function forkInternal(augur, marketId, userAuth, auth, callback) {
  repFaucet(augur, 10000000, auth, function (err) {
    if (err) return callback(err);
    augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err, marketsInfo) {
      var market = marketsInfo[0];
      var marketPayload = { tx: { to: marketId } };
      augur.api.Market.getEndTime(marketPayload, function (err, endTime) {
        displayTime("Market End Time", endTime);
        getTime(augur, auth, function (err, timeResult) {
          if (err) {
            console.log(chalk.red(err));
            return callback(err);
          }
          var day = 108000; // day
          endTime = parseInt(endTime, 10) + (day * 3); // push time after designated reporter time
          displayTime("Move time to ", endTime);
          setTimestamp(augur, endTime, timeResult.timeAddress, auth, function (err) {
            if (err) {
              console.log(chalk.red(err));
              return callback(err);
            }
            var priceOrOutcome = market.marketType === "scalar" ? market.minPrice : 0;
            var payoutNumerators = getPayoutNumerators(market, priceOrOutcome, false);
            goToFork(augur, marketId, payoutNumerators, timeResult.timeAddress, userAuth, function (err) {
              if (err) {
                console.log(chalk.red(err));
                return callback(err);
              }
              console.log(chalk.green("Fork Done"));
              callback(null);
            });
          });
        });
      });
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> marketId,<user priv key>"));
  console.log(chalk.red("parameter 1: marketId is needed"));
  console.log(chalk.red("parameter 2: user priv key is needed, env var REPORTER_PRIVATE_KEY can be used, or blank to use ETHEREUM_PRIVATE_KEY"));
  console.log(chalk.yellow("user will be given REP sufficient to cause a fork"));
  callback(null);
}

function fork(augur, params, auth, callback) {
  if (!params || params === "help" || params.split(",").length < 1) {
    help(callback);
  } else {
    var paramArray = params.split(",");
    var marketId = paramArray[0];
    var userAuth = null;
    if (process.env.REPORTER_PRIVATE_KEY) {
      userAuth = getPrivateKeyFromString(process.env.REPORTER_PRIVATE_KEY);
    } else if (paramArray[2] !== undefined) {
      userAuth = getPrivateKeyFromString(paramArray[2]);
    } else {
      userAuth = auth;
    }

    console.log(chalk.yellow.dim("marketId"), marketId);
    console.log(chalk.yellow.dim("reporter"), userAuth.address);
    console.log(chalk.yellow.dim("owner"), auth.address);
    forkInternal(augur, marketId, userAuth, auth, callback);
  }
}

module.exports = fork;
