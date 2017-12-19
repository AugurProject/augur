/**
 * @todo Update function description & return information once function has been implemented.
 */

"use strict";

var augurNode = require("../augur-node");

/**
 * This function has not been implemented yet. Returns the reporting windows where a specific user has unclaimed reporting fees. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Contract address of the universe in which the reporting windows exist, as a hexadecimal string.
 * @param {string} p.account Ethereum address of the user who has unclaimed reporting fees, as a hexadecimal string.
 * @param {function} callback Called after the reporting windows have been retrieved.
 * @return {} Pending.
 */
function getReportingWindowsWithUnclaimedFees(p, callback) {
  augurNode.submitRequest("getReportingWindowsWithUnclaimedFees", p, callback);
}

module.exports = getReportingWindowsWithUnclaimedFees;
