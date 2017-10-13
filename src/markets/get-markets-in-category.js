"use strict";

var augurNode = require("../augur-node");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.category Category for which to get markets.
 * @return {Object} Market info object.
 */
function getMarketsInCategory(p, callback) {
  augurNode.submitRequest("getMarketsInCategory", p, callback);
}

module.exports = getMarketsInCategory;
