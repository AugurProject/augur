#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var createOrders = require("./lib/create-orders");
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  approveAugurEternalApprovalValue(augur, augur.rpc.getCoinbase(), function (err) {
    if (err) return console.error(err);
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    augur.markets.getMarkets({ universe: universe, sortBy: "creationBlock" }, function (err, marketIDs) {
      if (err) return console.error(err);
      createOrders(augur, marketIDs, function (err) {
        if (err) console.error("create-orders failed:", err);
        process.exit();
      });
    });
  });
});
