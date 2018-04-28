#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");

function help() {
  console.log(chalk.red("Show initial reporter account for market"));
  console.log(chalk.red("Displays all 0s if market hasn't been reported on"));
}

/**
 * Move time to Market end time and do initial report
 */
function showInitialReporter(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var marketId = args.opt.marketId;
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

module.exports = showInitialReporter;
