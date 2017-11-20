#!/usr/bin/env node

"use strict";

var Augur = require("../src");
var constants = require("../src/constants");

var augur = new Augur();

var DEBUG = true;

augur.rpc.setDebugOptions({ connect: true, broadcast: false });

var ethereumNode = {
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546",
};
var augurNode = "ws://127.0.0.1:9001";

var marketID = "0xa3cdfc0629d95ab7a7a2a348fccf770f77ce35e3";
var numOutcomes = 2;
var numCompleteSets = 10;

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

augur.connect({ ethereumNode: ethereumNode, augurNode: augurNode }, function (err, connectionInfo) {
  if (err) return console.error(err);
  buyCompleteSets(marketID, numCompleteSets, numOutcomes, function (err) {
    if (err) console.error(err);
    process.exit();
  });
});
