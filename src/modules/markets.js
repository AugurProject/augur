"use strict";

var clone = require("clone");
var isFunction = require("../utils/is-function");
var store = require("../store");

module.exports = {

  // market: hash id
  getWinningOutcomes: function (market, callback) {
    var tx, winningOutcomes, numOutcomes, self = this;
    tx = clone(store.getState().contractsAPI.functions.Markets.getWinningOutcomes);
    tx.params = market;
    if (!isFunction(callback)) {
      winningOutcomes = this.fire(tx);
      if (!winningOutcomes) return null;
      if (winningOutcomes.error || winningOutcomes.constructor !== Array) {
        return winningOutcomes;
      }
      numOutcomes = this.getMarketNumOutcomes(market);
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
