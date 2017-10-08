"use strict";

var augurNode = require("../augur-node");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.marketID Market contract address for which to lookup info, as a hexadecimal string.
 * @return {Object} Market info object.
 */
function getMarketInfo(p, callback) {
  augurNode.submitRequest("getMarketInfo", p, callback);
}

module.exports = getMarketInfo;
