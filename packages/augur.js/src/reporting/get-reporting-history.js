/**
 * @todo Add descriptions for Report.isIndeterminate & Report.isSubmitted.
 */

"use strict";

/**
 * Serves as an enum for the state of a stake token.
 * @typedef {Object} REPORTING_STATE
 * @property {string} PRE_REPORTING Market's end time has not yet come to pass.
 * @property {string} DESIGNATED_REPORTING Market's end time has occurred, and it is pending a designated report.
 * @property {string} DESIGNATED_DISPUTE Market's designated report has been submitted and is allowed to be disputed.
 * @property {string} AWAITING_NO_REPORT_MIGRATION Either the disignated report was disputed, or the designated reporter failed to submit a report, and the market is waiting for the next reporting phase to begin.
 * @property {string} FIRST_REPORTING Market's designated report was disputed, and users can place stake on outcomes.
 * @property {string} FIRST_DISPUTE Market's first report has been submitted and is allowed to be disputed.
 * @property {string} LAST_REPORTING Market's first report was disputed, and users can place stake on outcomes.
 * @property {string} LAST_DISPUTE Market's first report has been submitted and is allowed to be disputed to cause a fork.
 * @property {string} FORKING Market's last report was disputed, causing a fork. Users can migrate their REP to the universe of their choice.
 * @property {string} FINALIZED An outcome for the market has been determined.
 * @property {string} AWAITING_FORK_MIGRATION Pending documentation. Possibly deprecated.
 * @property {string} AWAITING_FINALIZATION Pending documentation. Possibly deprecated.
 */

/**
 * @typedef {Object} Report
 * @property {string} transactionHash Hash to look up the reporting transaction receipt.
 * @property {number} logIndex Number of the log index position in the Ethereum block containing the reporting transaction.
 * @property {number} creationBlockNumber Number of the Ethereum block containing the reporting transaction.
 * @property {string} blockHash Hash of the Ethereum block containing the reporting transaction.
 * @property {number} creationTime Timestamp, in seconds, when the Ethereum block containing the reporting transaction was created.
 * @property {string} marketId Contract address of the market, as a hexadecimal string.
 * @property {REPORTING_STATE} marketReportingState Reporting state of the market.
 * @property {string} reportingWindow Reporting window the market is in currently.
 * @property {number[]} payoutNumerators Array representing the payout set.
 * @property {number} amountStaked Description the reporter has staked on the outcome of their report.
 * @property {string} stakeToken Contract address of the stake token, as a hexadecimal string.
 * @property {boolean} isCategorical Whether the market is categorical.
 * @property {boolean} isScalar Whether the market is scalar.
 * @property {boolean} isIndeterminate Description pending.
 * @property {boolean} isSubmitted Description pending.
 */

var augurNode = require("../augur-node");

/**
 * Returns information about the reports submitted by a particular user. For reporting windows that have ended, this includes the final outcome of the market, whether the user’s report matched that final outcome, how much REP the user gained or lost from redistribution, and how much the user earned in reporting fees. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.reporter Ethereum address of the reporter for which to retrieve reporting history, as a hexadecimal string.
 * @param {string=} p.universe Contract address of the universe in which to look up the reporting history, as a hexadecimal string. Either this parameter, the market ID, or the reporting window must be specified.
 * @param {string=} p.marketId Contract address of the market in which to look up the reporting history, as a hexadecimal string. Either this parameter, the universe, or the reporting window must be specified.
 * @param {string=} p.reportingWindow Contract address of the reporting window in which to look up the reporting history, as a hexadecimal string. Either this parameter, the universe, or the market ID must be specified.
 * @param {number=} p.earliestCreationTime Earliest timestamp, in seconds, at which to truncate history results. (This timestamp is when the block on the Ethereum blockchain containing the report submission was created.)
 * @param {number=} p.latestCreationTime Latest timestamp, in seconds, at which to truncate history results. (This timestamp is when the block on the Ethereum blockchain containing the report submission was created.)
 * @param {string=} p.sortBy Field name by which to sort the reporting history.
 * @param {boolean=} p.isSortDescending Whether to sort the reporting history in descending order by sortBy field.
 * @param {string=} p.limit Maximum number of reporting history reports to return.
 * @param {string=} p.offset Number of reporting history reports to truncate from the beginning of the results.
 * @param {function} callback Called when reporting history has been received and parsed.
 * @return {Object} Reporting history, keyed by universe or market ID. Each report is of type {@link Report}.
 */
function getReportingHistory(p, callback) {
  augurNode.submitRequest("getReportingHistory", p, callback);
}

module.exports = getReportingHistory;
