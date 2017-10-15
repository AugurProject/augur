"use strict";

/** Type definition for MarketCreationCosts.
 * @typedef {Object} MarketCreationCosts
 * @property {string} targetReporterGasCosts Amount of Ether required to pay for the gas to Report on this market, as a base-10 string.
 * @property {string} validityBond Amount of Ether to be held on-contract and repaid when the market is resolved with a non-Invalid outcome, as a base-10 string.
 */

var async = require("async");
var speedomatic = require("speedomatic");
var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.universeID Universe on which to create this market.
 * @param {number} p._endTime Market expiration timestamp, in seconds.
 * @param {function} callback Called when all market creation costs have been looked up.
 * @return {MarketCreationCosts} Cost breakdown for creating a new market.
 */
function getMarketCreationCostBreakdown(p, callback) {
  api().Universe.getReportingWindowByTimestamp({
    tx: { to: p.universeID },
    _timestamp: p._endTime
  }, function (err, reportingWindowAddress) {
    if (err) return callback(err);
    async.parallel({
      targetReporterGasCosts: function (next) {
        api().MarketFeeCalculator.getTargetReporterGasCosts(function (err, targetReporterGasCosts) {
          if (err) return next(err);
          next(null, speedomatic.unfix(targetReporterGasCosts, "string"));
        });
      },
      validityBond: function (next) {
        api().MarketFeeCalculator.getValidityBond({ _reportingWindow: reportingWindowAddress }, function (err, validityBond) {
          if (err) return next(err);
          next(null, speedomatic.unfix(validityBond, "string"));
        });
      }
    }, function (err, marketCreationCostBreakdown) {
      if (err) return callback(err);
      callback(null, marketCreationCostBreakdown);
    });
  });
}

module.exports = getMarketCreationCostBreakdown;
