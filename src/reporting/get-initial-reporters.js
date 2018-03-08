"use strict";

/**
 * @typedef {Object} InitialReporter
 * @property {string} marketId Ethereum contract address of the Market for which the Initial Report was submitted
 * @property {string} reporter Ethereum address of the Reporter who submitted the Initial Report.
 * @property {number} amountStaked Amount of attoREP the Reporter Staked in the Initial Report.
 * @property {string} initialReporter Ethereum address of the InitialReporter contract to which the Initial Report was submitted.
 * @property {boolean} redeemed Whether the Reporter has redeemed their REP from the InitialReporter contract.
 * @property {boolean} isDesignatedReporter Whether `reporter` was the Designated Reporter (as opposed to the First Public Reporter).
 * @property {number} repBalance Amount of REP that the InitialReporter contract has as its balance.
 */

var augurNode = require("../augur-node");

/**
 * Returns a list of InitialReporter contracts that a given Reporter has Staked REP in, along with how much attoREP was Staked and how much has been redeemed.
 *
 * @param {Object} p Parameters object.
 * @param {string} p.reporter Ethereum address of a Reporter who has Staked REP in InitialReporter contracts, as a hexadecimal string.
 * @param {boolean?} p.redeemed If true, the returned results will include only InitialReporter contracts where the Reporter has redeemed Staked REP; if false, the returned results will include only InitialReporter contracts where the Reporter has not redeemed Staked REP. If not specified, the results will include all InitialReporters in which the Repoter has Staked REP.
 * @param {boolean?} p.withRepBalance Whether the InitialReporter contract has a balance greater than 0. If set to true, only InitialReporters with a balance greater than 0 will be returned.
 * @param {function} callback Called after the InitialReporters have been retrieved.
 * @return {Object} Object containing InitialReporter objects, keyed by the Ethereum contract address of the InitialReporter.
 */
function getInitialReporters(p, callback) {
  augurNode.submitRequest("getInitialReporters", p, callback);
}

module.exports = getInitialReporters;
