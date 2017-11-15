"use strict";

/** Type definition for MarketCreationCostBreakdown.
 * @typedef {Object} MarketCreationCostBreakdown
 * @property {string} designatedReportNoShowReputationBond Amount of Reputation required to incentivize the designated reporter to show up and report, as a base-10 string.
 * @property {string} targetReporterGasCosts Amount of Ether required to pay for the gas to Report on this market, as a base-10 string.
 * @property {string} validityBond Amount of Ether to be held on-contract and repaid when the market is resolved with a non-Invalid outcome, as a base-10 string.
 */

var async = require("async");
var assign = require("lodash.assign");
var speedomatic = require("speedomatic");
var createCurrentReportingWindow = require("./create-current-reporting-window");
var api = require("../api");
var noop = require("../utils/noop");
var ZERO = require("../constants").ZERO;

/**
 * Note: this function will send a transaction if needed to create the current reporting window.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Universe on which to create this market.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} callback Called when all market creation costs have been looked up.
 * @return {MarketCreationCostBreakdown} Cost breakdown for creating a new market.
 */
function getMarketCreationCostBreakdown(p, callback) {
  var universePayload = { tx: { to: p.universe } };
  api().Universe.getDesignatedReportNoShowBond(universePayload, function (err, designatedReportNoShowBond) {
    if (err) return callback(err);
    var createCurrentReportingWindowParams = assign({}, p, {
      onSent: noop,
      onSuccess: function () { getMarketCreationCostBreakdown(p, callback); },
      onFailed: callback,
    });
    var designatedReportNoShowReputationBond = speedomatic.unfix(designatedReportNoShowBond);
    if (designatedReportNoShowReputationBond.eq(ZERO)) return createCurrentReportingWindow(createCurrentReportingWindowParams);
    async.parallel({
      targetReporterGasCosts: function (next) {
        api().Universe.getTargetReporterGasCosts(universePayload, function (err, targetReporterGasCosts) {
          if (err) return next(err);
          if (speedomatic.unfix(targetReporterGasCosts).eq(ZERO)) return createCurrentReportingWindow(createCurrentReportingWindowParams);
          next(null, speedomatic.unfix(targetReporterGasCosts, "string"));
        });
      },
      validityBond: function (next) {
        api().Universe.getValidityBond(universePayload, function (err, validityBond) {
          if (err) return next(err);
          if (speedomatic.unfix(validityBond).eq(ZERO)) return createCurrentReportingWindow(createCurrentReportingWindowParams);
          next(null, speedomatic.unfix(validityBond, "string"));
        });
      },
    }, function (err, marketCreationCostBreakdown) {
      if (err) return callback(err);
      callback(null, assign(marketCreationCostBreakdown, { designatedReportNoShowReputationBond: designatedReportNoShowReputationBond.toFixed() }));
    });
  });
}

module.exports = getMarketCreationCostBreakdown;
