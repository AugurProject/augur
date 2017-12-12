#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var fillBothOrderTypes = require("./lib/fill-both-order-types");
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var outcomeToTrade = 0;
var sharesToTrade = "1";

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var fillerAddress = augur.rpc.getCoinbase();
  approveAugurEternalApprovalValue(augur, fillerAddress, function (err) {
    if (err) return console.error(err);
    fillBothOrderTypes(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, function (err) {
      if (err) console.error("fillBothOrderTypes failed:", err);
      process.exit();
    });
  });
});
