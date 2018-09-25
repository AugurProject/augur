"use strict";

/** Type definition for MarketCreationCost.
 * @typedef {Object} MarketCreationCost
 * @property {string} designatedReportNoShowReputationBond Amount of Reputation required to incentivize the designated reporter to show up and report, as a base-10 string.
 * @property {string} etherRequiredToCreateMarket Sum of the Ether required to pay for Reporters' gas costs and the validity bond, as a base-10 string.
 */

var assign = require("lodash").assign;
var async = require("async");
var immutableDelete = require("immutable-delete");
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
  var universePayload = assign({}, immutableDelete(p, "universe"), { tx: assign({ to: p.universe, send: false }, p.tx) });
  async.parallel({
    designatedReportNoShowReputationBond: function (next) {
      api().Universe.getOrCacheDesignatedReportNoShowBond(universePayload, function (err, designatedReportNoShowBond) {
        if (err) return next(err);
        next(null, speedomatic.unfix(designatedReportNoShowBond, "string"));
      });
    },
    etherRequiredToCreateMarket: function (next) {
      api().Universe.getOrCacheMarketCreationCost(universePayload, function (err, marketCreationCost) {
        if (err) return next(err);
        next(null, speedomatic.unfix(marketCreationCost, "string"));
      });
    },
  }, callback);
}

module.exports = getMarketCreationCost;
