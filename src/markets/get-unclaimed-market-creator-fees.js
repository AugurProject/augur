"use strict";

var augurNode = require("../augur-node");

/**
 * Returns information about unclaimed market creator fees. Fees are only available on finalized markets.
 * @param {Object} p Parameters object.
 * @param {string[]} p.marketIDs Contract addresses of the markets for which to get details, as hexadecimal strings.
 * @returns {Object.<string, number>}
 */
function getUnclaimedMarketCreatorFees(p, callback) {
  augurNode.submitRequest("getUnclaimedMarketCreatorFees", p, callback);
}

module.exports = getUnclaimedMarketCreatorFees;
