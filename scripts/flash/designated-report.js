#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");

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

          augur.api.Market.doInitialReport({
            meta: auth,
            tx: { to: marketID  },
            _payoutNumerators: payoutNumerators,
            _invalid: invalid,
            onSent: function (result) {
              console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
              console.log(chalk.yellow.dim("Waiting for reply ...."));
            },
            onSuccess: function (result) {
              console.log(chalk.green.dim("Success:"), chalk.green(JSON.stringify(result)));
              process.exit(0);
            },
            onFailed: function (result) {
              console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
              process.exit(1);
            },
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
