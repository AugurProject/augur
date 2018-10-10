#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var Augur = require("../../src");
var fundAccounts = require("./lib/fund-accounts");
var getPrivateKey = require("./lib/get-private-key").getPrivateKey;
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var etherFundingPerAccount = process.env.ETHER_FUNDING_PER_ACCOUNT || "10000";

var accountsToFund = (process.argv[2] || "").split(",");

if (!Array.isArray(accountsToFund) || !accountsToFund.length) {
  console.error("Must specify accounts to fund");
  process.exit(1);
}

var keystoreFilePath = process.argv[3];

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

module.exports = fundAccounts;

if (require.main === module) {
  getPrivateKey(keystoreFilePath, function (err, auth) {
    if (err) return console.error("getPrivateKey failed:", err);
    augur.connect({ ethereumNode: connectionEndpoints.ethereumNode }, function (err) {
      if (err) return console.error("connect failed:", err);
      fundAccounts(augur, accountsToFund, etherFundingPerAccount, auth, function (err) {
        if (err) {
          console.error(chalk.red.bold("Fund accounts failed:"), err);
          process.exit(1);
        }
        process.exit(0);
      });
    });
  });
}
