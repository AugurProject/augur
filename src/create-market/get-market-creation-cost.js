"use strict";

/** Type definition for MarketCreationCost.
 * @typedef {Object} MarketCreationCost
 * @property {string} designatedReportNoShowReputationBond Amount of Reputation required to incentivize the designated reporter to show up and report, as a base-10 string.
 * @property {string} etherRequiredToCreateMarket Sum of the Ether required to pay for Reporters' gas costs and the validity bond, as a base-10 string.
 */

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
 * @param {function} callback Called after the market creation cost has been looked up.
 * @return {MarketCreationCost} Costs of creating a new market.
 */
function getMarketCreationCost(p, callback) {
  var universePayload = { tx: { to: p.universe } };
  api().Universe.getDesignatedReportNoShowBond(universePayload, function (err, designatedReportNoShowBond) {
    if (err) return callback(err);
    var createCurrentReportingWindowParams = assign({}, p, {
      onSent: noop,
      onSuccess: function () { getMarketCreationCost(p, callback); },
      onFailed: callback,
    });
    var designatedReportNoShowReputationBond = speedomatic.unfix(designatedReportNoShowBond);
    if (designatedReportNoShowReputationBond.eq(ZERO)) return createCurrentReportingWindow(createCurrentReportingWindowParams);
    api().Universe.getMarketCreationCost(universePayload, function (err, marketCreationCost) {
      if (err) return callback(err);
      var etherRequiredToCreateMarket = speedomatic.unfix(marketCreationCost);
      if (etherRequiredToCreateMarket.eq(ZERO)) return createCurrentReportingWindow(createCurrentReportingWindowParams);
      callback(null, {
        designatedReportNoShowReputationBond: designatedReportNoShowReputationBond.toFixed(),
        etherRequiredToCreateMarket: etherRequiredToCreateMarket.toFixed(),
      });
    });
  });
}

module.exports = getMarketCreationCost;
