"use strict";

var augurNode = require("../augur-node");

// { marketIDs }
function batchGetMarketInfo(p, callback) {
  augurNode.submitRequest("getMarketsInfo", p, callback);
}

module.exports = batchGetMarketInfo;
