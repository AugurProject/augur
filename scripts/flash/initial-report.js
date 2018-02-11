#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
const { getPrivateKeyFromString } = require("../dp/lib/get-private-key");
const repFaucet = require("../rep-faucet");

/**
 * Move time to Market end time and do initial report
 */
function initialReportInternal(augur, marketID, outcome, userAuth, invalid, auth, callback) {
  repFaucet(augur, userAuth, function (err) {
    if (err) { console.log(chalk.red("Error"), chalk.red(err)); callback(err); }
    augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
      var market = marketsInfo[0];
      var marketPayload = { tx: { to: marketID } };
      augur.api.Market.getEndTime(marketPayload, function (err, endTime) {
        console.log(chalk.yellow.dim("Market End Time"), chalk.yellow(endTime));
        getTime(augur, auth, function (timeResult) {
          endTime = parseInt(endTime, 10) + 300000; // push time after designated reporter time
          console.log(chalk.yellow.dim("moving timestamp +3d"), chalk.yellow(endTime));
          var timePayload = {
            meta: auth,
            tx: { to: timeResult.timeAddress  },
            _timestamp: parseInt(endTime, 10),
            onSent: function () {
            },
            onSuccess: function () {
              console.log(chalk.green.dim("Current time"), chalk.green(endTime));
              var numTicks = market.numTicks;
              var payoutNumerators = Array(market.numOutcomes).fill(0);
              payoutNumerators[outcome] = numTicks;

              var reportPayload = {
                meta: userAuth,
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
              };

              console.log(chalk.green.dim("reportPayload:"), chalk.green(JSON.stringify(reportPayload)));
              augur.api.Market.doInitialReport(reportPayload);
            },
            onFailed: function (result) {
              console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
              process.exit(1);
            },
          };
          augur.api.TimeControlled.setTimestamp(timePayload);
        });
      });
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax -->  params=marketID,0,<user priv key>,false"));
  console.log(chalk.red("parameter 1: marketID is needed"));
  console.log(chalk.red("parameter 2: outcome is needed"));
  console.log(chalk.red("parameter 3: user priv key is needed"));
  console.log(chalk.red("parameter 4: invalid is optional, default is false"));
  callback(null);
}

function initialReport(augur, params, auth, callback) {
  if (!params || params === "help" || params.split(",").length < 3) {
    help(callback);
  } else {
    var paramArray = params.split(",");
    var invalid = paramArray.length === 4 ? paramArray[3] : false;
    var marketID = paramArray[0];
    var outcomeId = paramArray[1];
    var userAuth = getPrivateKeyFromString(paramArray[2]);
    console.log(chalk.yellow.dim("marketID"), marketID);
    console.log(chalk.yellow.dim("outcomeId"), outcomeId);
    console.log(chalk.yellow.dim("reporter"), userAuth.address);
    console.log(chalk.yellow.dim("owner"), auth.address);
    console.log(chalk.yellow.dim("invalid"), invalid);
    initialReportInternal(augur, marketID, outcomeId, userAuth, invalid, auth, callback);
  }
}

module.exports = initialReport;
