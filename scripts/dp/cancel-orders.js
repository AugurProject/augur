#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var cancelOrders = require("./lib/cancel-orders");
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
    var creatorAddress = auth.address;
    approveAugurEternalApprovalValue(augur, creatorAddress, auth, function (err) {
      if (err) return console.error(err);
      var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
      cancelOrders(augur, creatorAddress, universe, auth, function (err) {
        if (err) console.error(err);
        process.exit();
      });
    });
  });
});
