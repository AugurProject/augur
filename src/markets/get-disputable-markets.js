"use strict";

var augurNode = require("../augur-node");

function getDisputableMarkets(p, callback) {
  augurNode.submitRequest("getDisputableMarkets", p, callback);
}

module.exports = getDisputableMarkets;
