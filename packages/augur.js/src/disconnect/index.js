"use strict";

var ethrpc = require("ethrpc");

function disconnect() {
  ethrpc.disconnect();
}

module.exports = disconnect;
