#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var displayTime = require("./display-time");

/**
 * Move time to Market end time and do initial report
 */
function showInitialReporterInternal(augur, marketID, auth, callback) {
  augur.api.Market.getInitialReporter({ tx: { to: marketID  }}, function (err, contractID) {
    if (err) {
      console.log(chalk.red("Error"), chalk.red(err));
      callback(err);
    }
    console.log(chalk.green.dim("Initial Reporter Contract address:"), chalk.green(JSON.stringify(contractID)));
    augur.api.InitialReporter.getReportTimestamp({ tx: { to: contractID  }}, function (err, value) {
      if (err) {
        console.log(chalk.red("Error"), chalk.red(err));
        callback(err);
      }
      console.log(chalk.green.dim("Report timestamp:"), chalk.green(JSON.stringify(value)));
    });
    augur.api.InitialReporter.getOwner({ tx: { to: contractID  }}, function (err, userAddress) {
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
  console.log(chalk.red("params syntax --> -p marketID"));
  console.log(chalk.red("parameter 1: marketID is needed"));
  callback(null);
}

function showInitialReporter(augur, params, auth, callback) {
  if (!params || params === "help") {
    help(callback);
  } else {
    var marketID = params;
    console.log(chalk.yellow.dim("marketID"), marketID);
    showInitialReporterInternal(augur, marketID, auth, callback);
  }
}

module.exports = showInitialReporter;
