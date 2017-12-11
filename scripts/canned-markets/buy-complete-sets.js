#!/usr/bin/env node

"use strict";

var Augur = require("../src");
var convertDecimalToFixedPoint = require("../../src/utils/convert-decimal-to-fixed-point");
var constants = require("../../src/constants");
var connectionEndpoints = require("./connection-endpoints");
var debugOptions = require("./debug-options");
var DEBUG = require("./debug-options").cannedMarkets;

var marketID = "0xa3cdfc0629d95ab7a7a2a348fccf770f77ce35e3";
var numOutcomes = 2;
var numCompleteSets = 10;

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

function buyCompleteSets(marketID, amount, numOutcomes, callback) {
  var cost = convertDecimalToFixedPoint(amount, constants.DEFAULT_NUM_TICKS[numOutcomes]);
  augur.api.CompleteSets.publicBuyCompleteSets({
    tx: { value: cost },
    _market: marketID,
    _amount: amount,
    onSent: function (res) {
      if (DEBUG) console.log("buyCompleteSets sent:", res.hash);
    },
    onSuccess: function (res) {
      if (DEBUG) console.log("buyCompleteSets success:", res.callReturn);
      callback(null);
    },
    onFailed: function (err) {
      console.error("buyCompleteSets failed:", err);
      callback(err);
    },
  });
}

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  buyCompleteSets(marketID, numCompleteSets, numOutcomes, function (err) {
    if (err) console.error(err);
    process.exit();
  });
});
