#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");
var doInitialReport = require("./do-initial-report");

/**
 * Move time to Market end time and do initial report
 */
function designateReportInternal(augur, marketID, outcomeID, invalid, auth) {
  augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
    var market = marketsInfo[0];
    var marketPayload = { tx: { to: marketID } };
    augur.api.Market.getEndTime(marketPayload, function (err, endTime) {
      console.log(chalk.red.dim("Market End Time"), chalk.red(endTime));
      getTime(augur, auth, function (timeResult) {
        endTime = parseInt(endTime, 10) + 10000;
        setTimestamp(augur, endTime, timeResult.timeAddress, auth, function () {
          var numTicks = market.numTicks;
          var payoutNumerators = Array(market.numOutcomes).fill(0);
          payoutNumerators[outcomeID] = numTicks;

          doInitialReport(augur, marketID, payoutNumerators, invalid, auth, function (err) {
            if (err) { console.log(chalk.red(err)); process.exit(1); }
            console.log(chalk.green("Initial Report Done"));
          });
        });
      });
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax -->  params=marketID,0,false"));
  console.log(chalk.red("parameter 1: marketID is needed"));
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
    var marketID = paramArray[0];
    var outcomeId = paramArray[1];
    console.log(chalk.yellow.dim("marketID"), marketID);
    console.log(chalk.yellow.dim("outcomeId"), outcomeId);
    console.log(chalk.yellow.dim("invalid"), invalid);
    designateReportInternal(augur, marketID, outcomeId, invalid, auth, callback);
  }
}

module.exports = designateReport;
