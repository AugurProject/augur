"use strict";

var augurNode = require("../augur-node");

function getUserTradingHistory(p, callback) {
  augurNode.submitRequest("getUserTradingHistory", p, callback);
}

module.exports = getUserTradingHistory;
