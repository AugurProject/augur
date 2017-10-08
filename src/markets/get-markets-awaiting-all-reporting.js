"use strict";

var augurNode = require("../augur-node");

function getMarketsAwaitingAllReporting(p, callback) {
  augurNode.submitRequest("getMarketsAwaitingAllReporting", p, callback);
}

module.exports = getMarketsAwaitingAllReporting;
