/**
 * @todo Update function return information
 */

"use strict";

var augurNode = require("../augur-node");

/**
 * Returns dispute information about markets. The returned result includes dispute round, and an array of payouts. Optionally includes "reporter" stake in each payout. Requires an Augur Node connection.

 * @param {Object} p Parameters object.
 * @param {string[]} p.marketIds Contract addresses of the markets for which to get details, as hexadecimal strings.
 * @param {string} p.reporter Ethereum address of the user who has staked rep, as a hexadecimal string.
 * @return {DisuteInfo[]}
 */
function getDisputeInfo(p, callback) {
  augurNode.submitRequest("getDisputeInfo", p, callback);
}

module.exports = getDisputeInfo;
