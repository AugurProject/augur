"use strict";

/** Type definition for MarketCreationCost.
 * @typedef {Object} MarketCreationCost
 * @property {string} designatedReportNoShowReputationBond Amount of Reputation required to incentivize the designated reporter to show up and report, as a base-10 string.
 * @property {string} etherRequiredToCreateMarket Sum of the Ether required to pay for Reporters' gas costs and the validity bond, as a base-10 string.
 */

var assign = require("lodash.assign");
var speedomatic = require("speedomatic");
var api = require("../api");

/**
 * Note: this function will send a transaction if needed to create the current reporting window.
 * @param {Object} p Parameters object.
 * @param {string} p.universe Universe on which to create this market.
 * @param {function} callback Called after the market creation cost has been looked up.
 * @return {MarketCreationCost} Costs of creating a new market.
 */
function getMarketCreationCost(p, callback) {
  var universePayload = { tx: { to: p.universe, send: false } };
  api().Universe.getOrCacheDesignatedReportNoShowBond(universePayload, function (err, designatedReportNoShowBond) {
    if (err) return callback(err);
    api().Universe.getOrCacheMarketCreationCost(universePayload, function (err, marketCreationCost) {
      if (err) return callback(err);
      callback(null, {
        designatedReportNoShowReputationBond: speedomatic.unfix(designatedReportNoShowBond, "string"),
        etherRequiredToCreateMarket: speedomatic.unfix(marketCreationCost, "string"),
      });
    });
  });
}

module.exports = getMarketCreationCost;
