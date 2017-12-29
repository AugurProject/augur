#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var createOrders = require("./lib/create-orders");
var getPrivateKey = require("./lib/get-private-key");
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var keystoreFilePath = process.argv[2];

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

getPrivateKey(keystoreFilePath, function (err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function (err) {
    if (err) return console.error(err);
    approveAugurEternalApprovalValue(augur, auth.address, auth, function (err) {
      if (err) return console.error(err);
      var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
      augur.markets.getMarkets({ universe: universe, sortBy: "creationBlock" }, function (err, marketIDs) {
        if (err) return console.error(err);
        createOrders(augur, marketIDs, auth, function (err) {
          if (err) console.error("create-orders failed:", err);
          process.exit();
        });
      });
    });
  });
});
