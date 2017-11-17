"use strict";

var augurNode = require("../augur-node");

function getMarkets(p, callback) {
  augurNode.submitRequest("getMarkets", p, callback);
}

module.exports = getMarkets;
