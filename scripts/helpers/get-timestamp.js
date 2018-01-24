#!/usr/bin/env node

"use strict";

var Augur = require("../../src");
var encodeTag = require("../../src/format/tag/encode-tag");

var augur = new Augur();

function getTime(auth, callback) {
  var timestamp = augur.api.Controller.getTimestamp();
  var controller = augur.contracts.addresses[augur.rpc.getNetworkID()].Controller;

  augur.api.Controller.lookup({ meta: auth, tx: {to: controller}, _key: encodeTag("Time")}, function (err, timeAddress) {
    callback({
      timestamp: timestamp,
      timeAddress: timeAddress,
    });
  });
}

module.exports = getTime;
