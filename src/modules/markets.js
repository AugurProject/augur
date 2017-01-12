/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var utils = require("../utilities");

module.exports = {

  getWinningOutcomes: function (market, callback) {
    // market: hash id
    var self = this;
    var tx = clone(this.tx.Markets.getWinningOutcomes);
    tx.params = market;
    if (!utils.is_function(callback)) {
      var winningOutcomes = this.fire(tx);
      if (!winningOutcomes) return null;
      if (winningOutcomes.error || winningOutcomes.constructor !== Array) {
        return winningOutcomes;
      }
      var numOutcomes = this.getMarketNumOutcomes(market);
      return numOutcomes && numOutcomes.error ? numOutcomes : winningOutcomes.slice(0, numOutcomes);
    }
    this.fire(tx, function (winningOutcomes) {
      if (!winningOutcomes) return callback(null);
      if (winningOutcomes.error || winningOutcomes.constructor !== Array) {
        return callback(winningOutcomes);
      }
      self.getMarketNumOutcomes(market, function (numOutcomes) {
        if (numOutcomes && numOutcomes.error) {
          return callback(numOutcomes);
        }
        callback(winningOutcomes.slice(0, numOutcomes));
      });
    });
  }
};
