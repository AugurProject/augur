"use strict";

var assign = require("lodash.assign");
var async = require("async");
var BigNumber = require("bignumber.js");
var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.address Address for which to look up share balances.
 * @param {string} p.market Market for which to look up share balances.
 * @return {string[]} Number of shares for each outcome of this market.
 */
function getPositionInMarket(p, callback) {
  var marketPayload = { tx: { to: p.market } };
  api().Market.getNumberOfOutcomes(marketPayload, function (err, numberOfOutcomes) {
    if (err) return callback(err);
    api().Market.getNumTicks(marketPayload, function (err, numTicks) {
      if (err) return callback(err);
      var bnNumTicks = new BigNumber(numTicks, 16);
      var positionInMarket = new Array(parseInt(numberOfOutcomes, 16));
      async.forEachOf(positionInMarket, function (_, outcome, nextOutcome) {
        api().Market.getShareToken(assign({ _outcome: outcome }, marketPayload), function (err, shareToken) {
          if (err) return nextOutcome(err);
          api().ShareToken.balanceOf({ _owner: p.address, tx: { to: shareToken } }, function (err, shareTokenBalance) {
            if (err) return nextOutcome(err);
            positionInMarket[outcome] = new BigNumber(shareTokenBalance, 16).dividedBy(bnNumTicks).toFixed();
            nextOutcome();
          });
        });
      }, function (err) {
        if (err) return callback(err);
        callback(null, positionInMarket);
      });
    });
  });
}

module.exports = getPositionInMarket;
