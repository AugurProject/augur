"use strict";

var augurNode = require("../augur-node");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.universe Universe address for which to get markets.
 * @return {Object} Market info object.
 */
function getMarketsInfo(p, callback) {
  augurNode.submitRequest("getMarketsInfo", p, callback);
}

module.exports = getMarketsInfo;
