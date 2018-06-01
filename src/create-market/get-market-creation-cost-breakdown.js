"use strict";

/** Type definition for MarketCreationCostBreakdown.
 * @typedef {Object} MarketCreationCostBreakdown
 * @property {string} designatedReportNoShowReputationBond Amount of Reputation required to incentivize the designated reporter to show up and report, as a base-10 string.
 * @property {string} targetReporterGasCosts Amount of Ether required to pay for the gas to Report on this market, as a base-10 string.
 * @property {string} validityBond Amount of Ether to be held on-contract and repaid when the market is resolved with a non-Invalid outcome, as a base-10 string.
 */

var async = require("async");
var speedomatic = require("speedomatic");
var api = require("../api");

/**
 * Note: this function will send a transaction if needed to create the current reporting window.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Universe on which to create this market.
 * @param {function} callback Called when all market creation costs have been looked up.
 * @return {MarketCreationCostBreakdown} Cost breakdown for creating a new market.
 */
function getMarketCreationCostBreakdown(p, callback) {
  var universePayload = { tx: { to: p.universe, send: false } };
  async.parallel({
    designatedReportNoShowReputationBond: function (next) {
      api().Universe.getOrCacheDesignatedReportNoShowBond(universePayload, function (err, designatedReportNoShowBond) {
        if (err) return next(err);
        next(null, speedomatic.unfix(designatedReportNoShowBond, "string"));
      });
    },
    targetReporterGasCosts: function (next) {
      api().Universe.getOrCacheTargetReporterGasCosts(universePayload, function (err, targetReporterGasCosts) {
        if (err) return next(err);
        next(null, speedomatic.unfix(targetReporterGasCosts, "string"));
      });
    },
    validityBond: function (next) {
      api().Universe.getOrCacheValidityBond(universePayload, function (err, validityBond) {
        if (err) return next(err);
        next(null, speedomatic.unfix(validityBond, "string"));
      });
    },
    reportingFeeDivisor: function (next) {
      api().Universe.getOrCacheReportingFeeDivisor(universePayload, function (err, reportingFeeDivisor) {
        if (err) return next(err);
        next(null, speedomatic.unfix(reportingFeeDivisor, "string"));
      });
    },
  }, callback);
}

module.exports = getMarketCreationCostBreakdown;
