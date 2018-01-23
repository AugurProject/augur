#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var chalk = require("chalk");
var connectionEndpoints = require("../connection-endpoints");
var getPrivateKey = require("../canned-markets/lib/get-private-key");
var getTime = require("./get-timestamp");

var marketID = process.argv[2];
var outcome = process.argv[3];
var invalid = process.argv[4];

var augur = new Augur();

/**
 * Move time to Market end time and do initial report
 */
getPrivateKey(null, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error(err);
    if (!invalid) { invalid = false; } else { invalid = true; }
    augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
      var market = marketsInfo[0];
      var marketPayload = { tx: { to: marketID } };
      augur.api.Market.getEndTime(marketPayload, function (err, endTime) {
        console.log(chalk.red.dim("Market End Time"), chalk.red(endTime));
        getTime(auth, function (timeResult) {
          endTime = parseInt(endTime, 10) + 10000;
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
                meta: auth,
                tx: { to: marketID  },
                _payoutNumerators: payoutNumerators,
                _invalid: invalid,
                onSent: function (result) {
                  console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
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
});


