"use strict";

var augurNode = require("../augur-node");

function getMarketsClosingInDateRange(p, callback) {
  augurNode.submitRequest("getMarketsClosingInDateRange", p, callback);
}

module.exports = getMarketsClosingInDateRange;
