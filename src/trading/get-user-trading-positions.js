"use strict";

var augurNode = require("../augur-node");

function getUserTradingPositions(p, callback) {
  augurNode.submitRequest("getUserTradingPositions", p, callback);
}

module.exports = getUserTradingPositions;
