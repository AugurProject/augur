"use strict";

var augurNode = require("../augur-node");

function getMarketsAwaitingLimitedReporting(p, callback) {
  augurNode.submitRequest("getMarketsAwaitingLimitedReporting", p, callback);
}

module.exports = getMarketsAwaitingLimitedReporting;
