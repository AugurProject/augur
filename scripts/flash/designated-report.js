#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");
var doInitialReport = require("./do-initial-report");

/**
 * Move time to Market end time and do initial report
 */
function designateReportInternal(augur, marketId, outcomeId, invalid, auth, callback) {
  augur.markets.getMarketsInfo({ marketIDs: [marketId] }, function (err, marketsInfo) {
    var market = marketsInfo[0];
    if (outcomeId > market.numOutcomes - 1) {
      return callback("outcomeId " + outcomeId + " Not Market Outcome ");
    }
    var marketPayload = { tx: { to: marketId } };
    augur.api.Market.getEndTime(marketPayload, function (err, endTime) {
      console.log(chalk.red.dim("Market End Time"), chalk.red(endTime));
      getTime(augur, auth, function (err, timeResult) {
        if (err) {
          console.log(chalk.red(err));
          return callback(err);
        }
        endTime = parseInt(endTime, 10) + 10000;
        setTimestamp(augur, endTime, timeResult.timeAddress, auth, function (err) {
          if (err) {
            console.log(chalk.red(err));
            return callback(err);
          }
          var numTicks = market.numTicks;
          var payoutNumerators = Array(market.numOutcomes).fill(0);
          payoutNumerators[outcomeId] = numTicks;

          doInitialReport(augur, marketId, payoutNumerators, invalid, auth, function (err) {
            if (err) {
              return callback("Initial Report Failed");
            }
            console.log(chalk.green("Initial Report Done"));
            callback(null);
          });
        });
      });
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> -p marketId,0,false"));
  console.log(chalk.red("parameter 1: marketId is needed"));
  console.log(chalk.red("parameter 2: outcome is needed"));
  console.log(chalk.red("parameter 3: invalid is optional, default is false"));
  callback(null);
}

function designateReport(augur, params, auth, callback) {
  if (!params || params === "help" || params.split(",").length < 2) {
    help(callback);
  } else {
    var paramArray = params.split(",");
    var invalid = paramArray.length === 3 ? paramArray[2] : false;
    var marketId = paramArray[0];
    var outcomeId = paramArray[1];
    console.log(chalk.yellow.dim("marketId"), marketId);
    console.log(chalk.yellow.dim("outcomeId"), outcomeId);
    console.log(chalk.yellow.dim("invalid"), invalid);
    designateReportInternal(augur, marketId, outcomeId, invalid, auth, callback);
  }
}

module.exports = designateReport;
