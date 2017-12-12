#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var cancelOrders = require("./lib/cancel-orders");
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  var creatorAddress = augur.rpc.getCoinbase();
  approveAugurEternalApprovalValue(augur, creatorAddress, function (err) {
    if (err) return console.error(err);
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    cancelOrders(augur, creatorAddress, universe, function (err) {
      if (err) console.error(err);
      process.exit();
    });
  });
});
