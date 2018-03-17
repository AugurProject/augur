#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var fillBothOrderTypes = require("./lib/fill-both-order-types");
var getPrivateKey = require("./lib/get-private-key").getPrivateKey;
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var keystoreFilePath = process.argv[2];

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

getPrivateKey(keystoreFilePath, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error(err);
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    var fillerAddress = auth.address;
    console.log(chalk.cyan.dim("networkId:"), chalk.cyan(augur.rpc.getNetworkID()));
    console.log(chalk.green.dim("universe:"), chalk.green(universe));
    approveAugurEternalApprovalValue(augur, fillerAddress, auth, function (err) {
      if (err) return console.error(err);
      var outcomeToFill = process.env.OUTCOME_TO_FILL || 1;
      var sharesToFill = process.env.SHARES_TO_FILL || "1";
      fillBothOrderTypes(augur, universe, fillerAddress, outcomeToFill, sharesToFill, auth, function (err) {
        if (err) console.error("fillBothOrderTypes failed:", err);
        process.exit();
      });
    });
  });
});
