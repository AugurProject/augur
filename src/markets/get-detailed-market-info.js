"use strict";

var augurNode = require("../augur-node");

function getDetailedMarketInfo(p, callback) {
  augurNode.submitRequest("getDetailedMarketInfo", p, callback);
}

module.exports = getDetailedMarketInfo;
