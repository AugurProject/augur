"use strict";

/**
 * @typedef {Object} DisputeToken
 * @property {string} disputeToken Contract address of the Dispute Token, as a hexadecimal string.
 * @property {string} marketId Ethereum address of the Market, as a hexadecimal string.
 * @property {number|null} payout0 Payout numerator 0 of the Dispute Token’s payout set.
 * @property {number|null} payout1 Payout numerator 1 of the Dispute Token’s payout set.
 * @property {number|null} payout2 Payout numerator 2 of the Dispute Token’s payout set. (Set to null for yesNo and Scalar Markets.)
 * @property {number|null} payout3 Payout numerator 3 of the Dispute Token’s payout set. (Set to null for yesNo and Scalar Markets.)
 * @property {number|null} payout4 Payout numerator 4 of the Dispute Token’s payout set. (Set to null for yesNo and Scalar Markets.)
 * @property {number|null} payout5 Payout numerator 5 of the Dispute Token’s payout set. (Set to null for yesNo and Scalar Markets.)
 * @property {number|null} payout6 Payout numerator 6 of the Dispute Token’s payout set. (Set to null for yesNo and Scalar Markets.)
 * @property {number|null} payout7 Payout numerator 7 of the Dispute Token’s payout set. (Set to null for yesNo and Scalar Markets.)
 * @property {boolean|number} isInvalid Whether the Market was determined to be invalid.
 * @property {number} balance Dispute Token balance the owner has staked, in ETH.
 * @property {boolean|null} winningToken Index of the Payout Numerator that was determined to be the Market's Final Outcome.
 * @property {boolean} tentativeWinning Index of the Payout Numerator that is tentatively the winning Outcome.
 * @property {boolean} claimed Whether the Dispute Token has been claimed by the owner.
 * @property {string} reportingState Reporting state of the Market.
 */

var augurNode = require("../augur-node");

/**
 * Returns the Dispute Tokens owned by a specific user that are either unclaimed or are in Markets that have not been Finalized.
 *
 * @param {Object} p Parameters object.
 * @param {string} p.universe Contract address of the Universe in which to retrieve the Dispute Tokens, as a hexadecimal string.
 * @param {string} p.account Contract address of the account for which to retrieve the Dispute Tokens, as a hexadecimal string.
 * @param {string?} p.disputeTokenState Token state by which to filter results.
 * @param {function} callback Called after the Dispute Tokens have been retrieved.
 * @return {Array.<DisputeToken>} Dispute Token details, keyed by Dispute Token ID.
 */
function getDisputeTokens(p, callback) {
  augurNode.submitRequest("getDisputeTokens", p, callback);
}

module.exports = getDisputeTokens;
