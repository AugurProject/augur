"use strict";

/**
 * @typedef {Object} UnclaimedFeeWindowInfo
 * @property {number} startTime Unix timestamp when the Fee Window begins.
 * @property {number} endTime Unix timestamp when the Fee Window ends.
 * @property {number} balance Balance the user has Staked in the Fee Window, in attoREP.
 * @property {string} expectedFees Expected Reporting Fees, in attoREP, that will be withdrawn when the user redeems their Stake in the Fee Window.
 */

var augurNode = require("../augur-node");

/**
 * Calls an Augur Node to return the Fee Windows where a specific user has unclaimed Reporting Fees.
 *
 * @param {Object} p Parameters object.
 * @param {string} p.universe Ethereum contract address of the Universe in which the Fee Windows exist, as a hexadecimal string.
 * @param {string} p.account Ethereum address of the user who has unclaimed Reporting Fees, as a hexadecimal string.
 * @param {boolean} p.includeCurrent Whether to include the current Fee Window in the returned results.
 * @param {function} callback Called after the Fee Windows have been retrieved.
 * @return {Object} Object containing UnclaimedFeeWindowInfo objects, indexed by the Ethereum address of each FeeWindow contract.
 */
function getFeeWindows(p, callback) {
  augurNode.submitRequest("getFeeWindows", p, callback);
}

module.exports = getFeeWindows;
