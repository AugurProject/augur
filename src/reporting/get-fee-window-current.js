/**
 * @todo Update function description & return information once function has been implemented.
 */

"use strict";

var augurNode = require("../augur-node");

/**
 * Returns the current active fee window for a universe. Optionally, get a reporter's stake. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Contract address of the universe to query for active fee window, as a hexadecimal string.
 * @param {string} p.reporter Ethereum address of the user who has staked rep on fee window fees, as a hexadecimal string.
 * @param {function} callback Called after the fee windows have been retrieved.
 * @return {} Pending.
 */
function getFeeWindowCurrent(p, callback) {
  augurNode.submitRequest("getFeeWindowCurrent", p, callback);
}

module.exports = getFeeWindowCurrent;
