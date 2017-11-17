"use strict";

var augurNode = require("../augur-node");

/**
 * @typedef {String} StakeTokenState
 * @value 'ALL' Returns all stake tokens. Could also omit this parameter entirely for same result.
 * @value 'UNFINALIZED' stake token is on a market that has not finalized yet
 * @value 'UNCLAIMED' This token is a part of a finalized market, was staked on the correct outcome, and has not been claimed yet.
 */


/**
 * @param {Object} p Parameters object.
 * @param {string} p.universe Look up stake tokens within this universe.
 * @param {string} p.account Look up stake tokens owned by this account
 * @param {StakeTokenState=} p.stakeTokenState Only return stake tokens in this state
 * @param {function} callback Called when reporting history has been received and parsed.
 * @return {Object} Stake token details, keyed by stakeTokenID.
 */
function getStakeTokens(p, callback) {
  augurNode.submitRequest("getStakeTokens", p, callback);
}

module.exports = getStakeTokens;
