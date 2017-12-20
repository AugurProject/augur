"use strict";

/**
 * Serves as an enum for the state of a stake token.
 * @typedef {Object} STAKE_TOKEN_STATE
 * @property {string} ALL Stake token can be in any state. (If no stake token state is specified, this is the default value.)
 * @property {string} UNFINALIZED Stake token is in a market that has not been finalized.
 * @property {string} UNCLAIMED Stake token is in a finalized market, was staked on the correct outcome, and has not been claimed yet.
 */

/**
 * @typedef {Object} StakeToken
 * @property {string} stakeToken Contract address of the stake token, as a hexidecimal string.
 * @property {string} marketID ID of the market, as a hexidecimal string.
 * @property {number|null} payout0 Payout numerator 0 of the stake token's payout set.
 * @property {number|null} payout1 Payout numerator 1 of the stake token's payout set.
 * @property {number|null} payout2 Payout numerator 2 of the stake token's payout set. Set to null for binary and scalar markets.
 * @property {number|null} payout3 Payout numerator 3 of the stake token's payout set. Set to null for binary and scalar markets.
 * @property {number|null} payout4 Payout numerator 4 of the stake token's payout set. Set to null for binary and scalar markets.
 * @property {number|null} payout5 Payout numerator 5 of the stake token's payout set. Set to null for binary and scalar markets.
 * @property {number|null} payout6 Payout numerator 6 of the stake token's payout set. Set to null for binary and scalar markets.
 * @property {number|null} payout7 Payout numerator 7 of the stake token's payout set. Set to null for binary and scalar markets.
 * @property {boolean} isInvalid Whether the market was determined to be invalid.
 * @property {number} amountStaked Amount the stake token owner has staked, in ETH.
 * @property {number|null} winningToken Description pending.
 * @property {boolean} claimed Whether the stake token has been claimed by the owner.
 * @property {REPORTING_STATE} reportingState Reporting state of the market.
 */

var augurNode = require("../augur-node");

/**
 * Returns the stake tokens owned by a specific user that are either unclaimed or are in markets that have not been finalized. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Contract address of the universe in which to retrieve the stake tokens, as a hexadecimal string.
 * @param {string} p.account Contract address of the account for which to retrieve the stake tokens, as a hexadecimal string.
 * @param {STAKE_TOKEN_STATE=} p.stakeTokenState Token state by which to filter results.
 * @param {function} callback Called when reporting history has been received and parsed.
 * @return {StakeToken[]} Stake token details, keyed by stake token ID.
 */
function getStakeTokens(p, callback) {
  augurNode.submitRequest("getStakeTokens", p, callback);
}

module.exports = getStakeTokens;
