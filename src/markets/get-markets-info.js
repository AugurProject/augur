/**
 * @todo Add more details for how outstanding shares, outcome volume, & market volume are calculated.
 */
"use strict";

/**
 * @typedef {Object} OutcomeInfo
 * @property {number} id Market outcome ID
 * @property {number} volume Trading volume for this outcome. (Method for calculating this is pending.)
 * @property {number} price Price of the outcome.
 * @property {string|null} description Description for the outcome.
 */

/**
 * @typedef {Object} MarketInfo
 * @property {string} id Address of a market, as a hexadecimal string.
 * @property {string} universe Address of a universe, as a hexadecimal string.
 * @property {string} type Type of market ("binary", "categorical", or "scalar").
 * @property {number} numOutcomes Total possible outcomes for the market.
 * @property {number} minPrice Minimum price allowed for a share on a market, in ETH. For binary & categorical markets, this is 0 ETH. For scalar markets, this is the bottom end of the range set by the market creator.
 * @property {number} maxPrice Maximum price allowed for a share on a market, in ETH. For binary & categorical markets, this is 1 ETH. For scalar markets, this is the top end of the range set by the market creator.
 * @property {string} cumulativeScale Difference between maxPrice and minPrice.
 * @property {string} author Ethereum address of the creator of the market, as a hexadecimal string.
 * @property {number} creationTime Timestamp when the Ethereum block containing the market creation was created, in seconds.
 * @property {number} creationBlock Number of the Ethereum block containing the market creation.
 * @property {number} creationFee Fee paid by the market creator to create the market, in ETH.
 * @property {number} reportingFeeRate Percentage rate of ETH sent to the reporting window containing the market whenever shares are settled. Reporting fees are later used to pay REP holders for Reporting on the Outcome of Markets.
 * @property {number} marketCreatorFeeRate Percentage rate of ETH paid to the market creator whenever shares are settled.
 * @property {number|null} marketCreatorFeesCollected Amount of fees the market creator collected from the market, in ETH.
 * @property {string} category Name of the category the market is in.
 * @property {Array<string|null>} tags Names with which the market has been tagged.
 * @property {number} volume Trading volume for this outcome. (Method for calculating this is pending.)
 * @property {number} outstandingShares Total shares in the market. (Method for calculating this is pending.)
 * @property {REPORTING_STATE|null} reportingState Reporting state name.
 * @property {string} reportingWindow Contract address of the reporting window the market is in, as a hexadecimal string.
 * @property {number} endTime Timestamp when the market event ends, in seconds.
 * @property {number|null} finalizationTime Timestamp when the market was finalized (if any), in seconds.
 * @property {string} description Description of the market.
 * @property {string|null} extraInfo Stringified JSON object containing resolutionSource, tags, longDescription, and outcomeNames (for categorical markets).
 * @property {string} designatedReporter Ethereum address of the market's designated report, as a hexadecimal string.
 * @property {number} designatedReportStake Amount of ETH the designated reporter staked on the outcome submitted in the designated report.
 * @property {string|null} resolutionSource Reference source used to determine the outcome of the market event.
 * @property {number} numTicks Number of possible prices, or ticks, between a market's minimum price and maximum price.
 * @property {number|null} consensus Consensus outcome for the market.
 * @property {OutcomeInfo[]} outcomes Array of OutcomeInfo objects.
 */

var augurNode = require("../augur-node");

/**
 * Returns information about markets that are stored on-contract. The returned result includes basic information about the markets as well as information about each market outcome. It does not include Order Book information; however the function `augur.trading.getOrders` can be used to get information about orders for the specified market. Requires an Augur Node connection.
 * @param {Object} p Parameters object.
 * @param {string[]} p.marketIds Contract addresses of the markets for which to get details, as hexadecimal strings.
 * @return {MarketInfo[]}
 */
function getMarketsInfo(p, callback) {
  augurNode.submitRequest("getMarketsInfo", p, callback);
}

module.exports = getMarketsInfo;
