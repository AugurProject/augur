"use strict";

var augurNode = require("../augur-node");

function getMarketClosingInDateRange(p, callback) {
  augurNode.submitRequest("getMarketClosingInDateRange", p, callback);
}

module.exports = getMarketClosingInDateRange;
