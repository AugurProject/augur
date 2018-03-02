#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");

/**
 * Move time to Market end time and do initial report
 */
function showInitialReporterInternal(augur, marketId, auth, callback) {
  augur.api.Market.getInitialReporter({ tx: { to: marketId  }}, function (err, contractId) {
    if (err) {
      console.log(chalk.red("Error"), chalk.red(err));
      callback(err);
    }
    console.log(chalk.green.dim("Initial Reporter Contract address:"), chalk.green(JSON.stringify(contractId)));
    augur.api.InitialReporter.getReportTimestamp({ tx: { to: contractId  }}, function (err, value) {
      if (err) {
        console.log(chalk.red("Error"), chalk.red(err));
        callback(err);
      }
      displayTime("Report timestamp:", value);
    });
    augur.api.InitialReporter.getOwner({ tx: { to: contractId  }}, function (err, userAddress) {
      if (err) {
        console.log(chalk.red("Error"), chalk.red(err));
        callback(err);
      }
      console.log(chalk.green.dim("User address:"), chalk.green(JSON.stringify(userAddress)));
      callback(null);
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> marketId"));
  console.log(chalk.red("parameter 1: marketId is needed"));
  callback(null);
}

function showInitialReporter(augur, params, auth, callback) {
  if (!params || params === "help") {
    help(callback);
  } else {
    var marketId = params;
    console.log(chalk.yellow.dim("marketId"), marketId);
    showInitialReporterInternal(augur, marketId, auth, callback);
  }
}

module.exports = showInitialReporter;
